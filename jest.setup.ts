import { TextEncoder, TextDecoder } from "util";

// В Node.js 18 и выше TextEncoder и TextDecoder доступны глобально, но в jsdom их нужно импортировать и добавить в глобальный объект
Object.assign(global, { TextDecoder, TextEncoder });

// Импортируем расширенные матчеры для jest из @testing-library/jest-dom
import "@testing-library/jest-dom";
