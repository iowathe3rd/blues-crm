import { prisma } from "~/db.server";

export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export const phoneNumberRegex = /^\+?77([0124567][0-8]\d{7})$/g;
export const stringRegex = /[a-яё]/i;
export const numberRegex = /[0-9]/i;

export function validatePassword(password: any) {
  if (typeof password !== "string" || password.length < 6) {
    return `Пароль должен быть типа строки и иметь больше 6 символов`;
  }
}

export function validatePasswordSimilarity(
  password: string,
  passwordSimilarity: string
) {
  if (password !== passwordSimilarity) {
    return `Пароли не совпадают`;
  }
}

export function validateEmail(email: any) {
  const regex = new RegExp(emailRegex);
  if (!regex.test(email)) {
    return `Email введен неправильно`;
  }
}

export function validatePhoneNumber(phoneNumber: any) {
  const regex = new RegExp(phoneNumberRegex);
  if (!regex.test(phoneNumber)) {
    return `Номер телефона введен неправильно`;
  }
}

export function validateString(string: string) {
  const regex = new RegExp(stringRegex);
  if (!string.match(regex)) {
    return `Данное поле должно иметь хотя бы одну большую букву и без символов`;
  }
}
export function validateNumber(number: number, length?: boolean) {
  if (length) {
    if (typeof number !== "number" || number <= 0) {
      return `Число должно быть числом и быть больше нуля`;
    }
  }
}

export async function validateExistingUser(id: string) {
  const candidate = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!candidate) return `Такого пользователя не существует`;
}

export async function validateExistingCourse(id: string) {
  const candidate = await prisma.course.findUnique({
    where: {
      id: id,
    },
  });
  if (!candidate) return `Такого курса не существует`;
}
