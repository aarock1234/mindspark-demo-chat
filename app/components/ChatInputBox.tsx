import { ChatRequestOptions } from 'ai';
import { FormEvent, useRef } from 'react';

interface ChatInputBoxProps {
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
	handleFileButtonClick: () => void;
	handleSubmit: (
		e: FormEvent<HTMLFormElement>,
		chatRequestOptions?: ChatRequestOptions | undefined
	) => void;
	input: string;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	base64Images: string[];
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
	handleFileChange,
	handleFileButtonClick,
	handleSubmit,
	input,
	handleInputChange,
	base64Images,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit(e, {
					data: { base64Images: JSON.stringify(base64Images) },
				});
			}}
			className="flex items-center justify-center"
		>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				multiple
				className="hidden"
			/>
			<button type="button" onClick={handleFileButtonClick} className="mr-2 p-2 text-3xl">
				📎
			</button>
			<input
				className="w-full rounded border border-gray-700 bg-gray-900 p-2"
				value={input}
				placeholder="Can you help me with this problem...?"
				onChange={handleInputChange}
			/>
		</form>
	);
};

export default ChatInputBox;
