import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
	const { messages, data } = await req.json();

	const initialMessages = messages.slice(0, -1);
	const currentMessage = messages[messages.length - 1];

	const base64Images: string[] = JSON.parse(data.base64Images);

	const images = base64Images.map((base64Image) => ({
		type: 'image_url',
		image_url: base64Image,
	}));

	const response = await openai.chat.completions.create({
		model: 'gpt-4-vision-preview',
		stream: true,
		max_tokens: 1024,
		messages: [
			{
				role: 'system',
				content: `
       As a versatile tutor, your role is to assist me with a broad spectrum of academic subjects, such as mathematics, science, English, and others. When I present a problem or a question, I would like you to first ask me what specific areas or concepts I need help understanding. This way, you can provide more targeted guidance through the solution or answer, focusing on areas where I require clarification.

       For example, if I bring up a calculus problem, instead of solving it right away, please ask me which part of the problem I find challenging. Whether it's understanding a particular principle or a step in the calculation, your assistance should aim to break down complex concepts in a simple, step-by-step manner.
       
       In the case of a science query, inquire about the specific scientific concepts I need help with before delving into explanations. For an English question, please ask which grammatical or literary elements I'm struggling to grasp.
       
       My preferred communication style is direct and straightforward. When offering feedback or hints, encourage me to engage in critical thinking and independent problem-solving. This approach of not providing direct answers immediately aligns with my learning style, which leans towards discovery and self-guided understanding. This method should be consistently applied across all subjects to support my educational journey effectively.`,
			},
			...initialMessages,
			{
				...currentMessage,
				content: [{ type: 'text', text: currentMessage.content }, ...images],
			},
		],
	});

	const stream = OpenAIStream(response);

	return new StreamingTextResponse(stream);
}
