import Hash from "@ioc:Adonis/Core/Hash";
import {
  HasMany,
  beforeCreate,
  beforeSave,
  column,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import { v4 } from "uuid";
import AppBaseModel from "./AppBaseModel";
import Participation from "./Participation";
import Poll from "./Poll";

export default class User extends AppBaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public lastName: string;

  @column()
  public firstName: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public roles: string[];

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /**
   * Relations
   */
  @hasMany(() => Poll)
  public polls: HasMany<typeof Poll>;

  @hasMany(() => Participation)
  public participations: HasMany<typeof Participation>;

  /**
   * Hooks
   */
  @beforeCreate()
  public static async generateUUID(user: User) {
    user.id = v4();
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @beforeSave()
  public static async formatData(user: User) {
    user.lastName = user.lastName.toUpperCase();
    user.firstName =
      user.firstName[0].toUpperCase() + user.firstName.slice(1).toLowerCase();
  }
}
