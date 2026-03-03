import { motion } from "framer-motion";

export function AnimatedEyes() {
	return (
		<div className="flex h-4 items-center gap-1">
			{[0, 1].map((eye) => (
				<div key={eye} className="relative h-4 w-4 overflow-hidden rounded-full bg-white">
					{/* Pupil */}
					<motion.div
						className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
						animate={{ x: [-3, 3, -3] }}
						transition={{
							repeat: Infinity,
							duration: 1.8,
							ease: "easeInOut",
						}}
					/>

					{/* Eyelid (blink) */}
					<motion.div
						className="absolute top-0 left-0 h-full w-full bg-indigo-600"
						animate={{ y: ["-100%", "0%", "-100%"] }}
						transition={{
							repeat: Infinity,
							duration: 0.5,
							repeatDelay: 6,
							ease: "easeInOut",
						}}
					/>
				</div>
			))}
		</div>
	);
}

export function DeadEyes() {
	return (
		<motion.div
			initial={{ rotate: 0 }}
			animate={{ rotate: [-3, 3, -3] }}
			transition={{
				repeat: Infinity,
				duration: 2,
				ease: "easeInOut",
			}}
			className="flex items-center gap-1"
		>
			<div className="relative flex h-5 w-8 items-center justify-center rounded-full bg-gray-200">
				{/* Eyes */}
				<div className="absolute top-1 left-1 font-bold text-[8px] text-gray-600">×</div>
				<div className="absolute top-1 right-1 font-bold text-[8px] text-gray-600">×</div>

				{/* Mouth */}
				<div className="absolute bottom-0 flex items-end justify-center">
					<div className="h-2 w-3 rounded-b-full bg-gray-700" />
				</div>

				{/* Tongue */}
				<motion.div
					className="absolute bottom-[-3px] h-2 w-2 rounded-full bg-pink-400"
					animate={{ y: [0, 1.5, 0] }}
					transition={{
						repeat: Infinity,
						duration: 1,
						ease: "easeInOut",
					}}
				/>
			</div>
		</motion.div>
	);
}
