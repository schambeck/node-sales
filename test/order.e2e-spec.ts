import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../src/order/order.module';
import { Order } from '../src/order/order.entity';
import { EntityNotFoundFilter } from '../src/exception/entity-not-found.filter';

describe('OrderController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        OrderModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Order],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new EntityNotFoundFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/orders (POST)', () => {
    const payload = { issuedDate: '2023-02-06', product: 'ABC', total: 1234.5 };
    const response = {
      id: 1,
      issuedDate: '2023-02-06',
      product: 'ABC',
      total: 1234.5,
    };
    return request(app.getHttpServer())
      .post('/orders')
      .send(payload)
      .expect(201)
      .expect(response);
  });

  it('/orders (POST): validation', () => {
    const payload = { product: '', total: 0 };
    const response = {
      statusCode: 400,
      message: [
        'Issued Date is required',
        'Product is required',
        'Total must be positive',
      ],
      error: 'Bad Request',
    };
    return request(app.getHttpServer())
      .post('/orders')
      .send(payload)
      .expect(400)
      .expect(response);
  });

  it('/orders/1 (PUT)', async () => {
    const toUpdate = {
      id: 1,
      issuedDate: '2023-02-06',
      product: 'ABCD',
      total: 1234.5,
    };
    const updated = {
      id: 1,
      issuedDate: '2023-02-06',
      product: 'ABCD',
      total: 1234.5,
    };
    return request(app.getHttpServer())
      .put('/orders/1')
      .send(toUpdate)
      .expect(200)
      .expect(updated);
  });

  it('/orders/1 (GET)', async () => {
    const response = {
      id: 1,
      issuedDate: '2023-02-06',
      product: 'ABCD',
      total: 1234.5,
    };
    return request(app.getHttpServer())
      .get('/orders/1')
      .expect(200)
      .expect(response);
  });

  it('/orders (GET)', () => {
    const page = {
      data: [
        { id: 1, issuedDate: '2023-02-06', product: 'ABCD', total: 1234.5 },
      ],
      meta: {
        itemsPerPage: 20,
        totalItems: 1,
        currentPage: 1,
        totalPages: 1,
        sortBy: [['product', 'ASC']],
      },
      links: { current: '/orders?page=1&limit=20&sortBy=product:ASC' },
    };
    return request(app.getHttpServer()).get('/orders').expect(200).expect(page);
  });

  it('/orders/1 (DELETE)', async () => {
    return request(app.getHttpServer()).delete('/orders/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
