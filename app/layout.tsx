import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'MindSpark',
	description: 'MindSpark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Head>
				<title>{metadata.title?.toString()}</title>
				<meta name="description" content={metadata.description?.toString()} />
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<html lang="en" className="bg-gray-950 text-white">
				<body className={inter.className}>
					<div className="flex justify-center items-center h-10 bg-gray-900">
						<img
							src="https://media.discordapp.net/attachments/1158929699251159063/1183664032390070393/image.png?ex=65892808&is=6576b308&hm=2b03bec8d994b3050a3e4f4154209dcd61ed004c4c96739ee53783785596a09f&=&format=webp&quality=lossless"
							alt="MindSpark"
							className="w-10"
						/>
						<h1 className="pl-2">MindSpark</h1>
					</div>
					{children}
				</body>
			</html>
		</>
	);
}
