import { QueryResult } from 'pg';
import { query } from '../db';
import { VALID_COLUMNS } from '../constants';
import { ValidColumns } from '../interfaces';

export default class Base<T extends QueryResult> {
  protected query;
  protected table;

  constructor(table: string) {
    this.table = table;
    this.query = query;
  }

  async findAll(): Promise<T[]> {
    const { rows } = await this.query<T>(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async findById(id: string): Promise<T | null> {
    const sql = `SELECT * FROM ${this.table} WHERE id = $1`;
    const { rows } = await this.query<T>(sql, [id]);

    return rows[0];
  }

  async create(data: Partial<T>): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const sql = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders}) RETURNING *`;

    const { rows } = await this.query<T>(sql, values);

    return rows[0];
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const columns = Object.keys(data);
    const setClause = columns.map((column, index) => `${column} = $${index + 1}`).join(', ');
    const values = Object.values(data);
    const sql = `UPDATE ${this.table} SET ${setClause} WHERE id = $${
      columns.length + 1
    } RETURNING *`;

    const { rows } = await this.query<T>(sql, [...values, id]);

    return rows[0];
  }

  async delete(id: string): Promise<number> {
    const sql = `DELETE FROM ${this.table} WHERE id = $1`;

    const { rowCount } = await this.query<T>(sql, [id]);

    return rowCount as number;
  }

  async findByColumnValue(
    column: ValidColumns,
    value: string | number | Date
  ): Promise<QueryResult<T>> {
    if (!VALID_COLUMNS.includes(column)) throw new Error('Invalid column');

    const query = `SELECT * FROM users WHERE ${column} = $1`;
    const data = await this.query<T>(query, [value]);

    return data;
  }
}
