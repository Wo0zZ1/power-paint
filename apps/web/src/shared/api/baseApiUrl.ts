import { isServer } from "@tanstack/react-query";

// В браузере путь относительный: шлюз отдаёт и страницы, и API с одного origin,
// поэтому кука уходит сама. На сервере origin'а нет, запрос идёт прямо в шлюз
// по внутреннему адресу, а куку приходится прокидывать вручную.
export const GET_BASE_API_URL = () =>
  isServer ? `${process.env.GATEWAY_URL}/api` : "/api";
