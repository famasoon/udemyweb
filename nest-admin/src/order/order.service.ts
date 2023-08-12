import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Order } from './order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService extends AbstractService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {
    super(orderRepository)
  }

  async paginate(page = 1, relations = []): Promise<any> {
    const { data, meta } = await super.paginate(page, relations)

    return {
      data: data.map(order => ({
        id: order.id,
        name: order.name,
        email: order.email,
        total: order.total,
        order_items: order.order_items,
        created_at: order.created_at,
      })),
      meta
    }
  }

  async chart() {
    return this.orderRepository.query(`SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, sum(i.price * i.quantity) as sum FROM orders o JOIN order_items i on o.id = i.order_id GROUP BY date`)
  }
}
