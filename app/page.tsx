'use client';

import Image from 'next/image';
import { Fragment, useRef, useState } from 'react';
import { useChat } from 'ai/react';

import ChatInputBox from './components/ChatInputBox';

export default function Chat() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: '/api/chat-with-vision',
	});
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [base64Images, setBase64Images] = useState<string[]>([]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
			setImageUrls((prev) => [...prev, ...newImageUrls]);

			const toBase64 = (file: File) =>
				new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = (e) => resolve(e.target?.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});

			const newBase64Images = await Promise.all(filesArray.map(toBase64));
			setBase64Images((prev) => [...prev, ...newBase64Images]);
		}
	};

	const handleRemoveFile = (index: number) => {
		setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
		setBase64Images((prev) => prev.filter((_, idx) => idx !== index));
		fileInputRef.current && (fileInputRef.current.value = '');
	};

	const FilePreview = () =>
		imageUrls.length > 0 && (
			<div className="flex space-x-2">
				{imageUrls.map((url, index) => (
					<Fragment key={index}>
						<div className="mb-4">
							<Image
								src={url}
								alt="File preview"
								width={50}
								height={50}
								className="rounded"
							/>
							<button
								type="button"
								onClick={() => handleRemoveFile(index)}
								className="text-xs"
							>
								Delete
							</button>
						</div>
					</Fragment>
				))}
			</div>
		);

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col space-y-4 px-4 pb-60 pt-20">
			{messages.map((message) => (
				<div key={message.id} className="whitespace-pre-wrap">
					{message.role === 'user' ? 'User: ' : 'AI: '}
					{message.content}
				</div>
			))}

			<div className="fixed bottom-0 left-0 right-0 w-full">
				<div className="mx-auto max-w-2xl px-4 py-8">
					<div className="rounded border border-gray-700 bg-gray-900 p-4">
						<FilePreview />
						<ChatInputBox
							handleFileChange={handleFileChange}
							handleFileButtonClick={handleFileButtonClick}
							handleSubmit={handleSubmit}
							input={input}
							handleInputChange={handleInputChange}
							base64Images={base64Images}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
