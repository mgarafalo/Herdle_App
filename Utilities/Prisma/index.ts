import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type IgnorePrismaBuiltins<PrismaClientKeyUnionGeneric extends string> =
  string extends PrismaClientKeyUnionGeneric
    ? string
    : PrismaClientKeyUnionGeneric extends ""
    ? PrismaClientKeyUnionGeneric
    : PrismaClientKeyUnionGeneric extends `$${string}`
    ? never
    : PrismaClientKeyUnionGeneric;

export type ModelName = IgnorePrismaBuiltins<keyof typeof prisma>;

export function getPrismaModel<SpecificModelName extends ModelName>(
  modelName: SpecificModelName
) {
  return prisma[modelName];
}

export async function findSingleGeneric<T>(
  collection: ModelName,
  identifierProperty: string,
  identifierValue: string | number | boolean,
  options: object = {}
): Promise<T> {
  return await (getPrismaModel(collection) as any).findFirst({
    where: {
      [identifierProperty]: identifierValue,
    },
    ...options,
  });
}

export async function findManyGeneric<T>(
  collection: ModelName,
  identifierProperty?: string,
  identifierValue?: string | number | boolean,
  options: object = {}
): Promise<T> {
  return await (getPrismaModel(collection) as any).findMany(
    identifierProperty
      ? {
          where: {
            [identifierProperty]: identifierValue,
          },
          ...options,
        }
      : {}
  );
}

export async function createGeneric<T>(
  collection: ModelName,
  data: object
): Promise<T> {
  return await (getPrismaModel(collection) as any).create({ ...data });
}

export async function updateSingleGeneric<T>(
  collection: ModelName,
  identifierProperty: string,
  identifierValue: string | number | boolean,
  updateProperty: string,
  updateValue: string | number | boolean | object,
  options: object = {}
): Promise<T> {
  return await (getPrismaModel(collection) as any).update({
    where: {
      [identifierProperty]: identifierValue,
    },
    data: {
      [updateProperty]: updateValue,
    },
    ...options,
  });
}

export async function updateManyGeneric<T>(
  collection: ModelName,
  identifierProperty: string,
  identifierValue: string | number | boolean,
  updateProperty: string,
  updateValue: string | number | boolean,
  options: object = {}
): Promise<T> {
  return await (getPrismaModel(collection) as any).updateMany({
    where: {
      [identifierProperty]: identifierValue,
    },
    data: {
      [updateProperty]: updateValue,
    },
    ...options,
  });
}

export async function deleteGeneric<T>(
  collection: ModelName,
  identifierProperty: string,
  identifierValue: string | number | boolean,
  options: object = {}
): Promise<T> {
  return await (getPrismaModel(collection) as any).delete({
    where: {
      [identifierProperty]: identifierValue,
    },
    ...options,
  });
}
