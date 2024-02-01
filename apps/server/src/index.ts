import path from 'node:path';
import { TransformStream } from 'node:stream/web';
import { fileURLToPath } from 'url';
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static';
import { StreamingTextResponse } from 'ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../public')
})

const chatBodyJsonSchema = {
  type: "object",
  properties: {
    messages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: {
            type: "string",
            enum: ["user", "assistant"]
          },
          content: {
            type: "string"
          }
        },
        required: ["role", "content"]
      }
    }
  },
  required: ["messages"]
}

interface ChatBody {
  messages: {
    role: string,
    content: string
  }[]
}

fastify.post('/chat/:id', {
  schema: { body: chatBodyJsonSchema },
}, async (request, reply) => {
  const body = request.body as ChatBody;
  console.info(body);

  // Dummy streaming response
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  setTimeout(() => {
    writer.write('Hello');
  }, 2000);
  setTimeout(() => {
    writer.write(' again');
  }, 4000);
  setTimeout(() => {
    writer.write(' bye!');
    writer.close();
  }, 6000);

  return new StreamingTextResponse(readable as any);
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
