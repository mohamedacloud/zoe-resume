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
							duration: 0.50,
							repeatDelay: 6,
							ease: "easeInOut",
						}}
					/>
				</div>
			))}
		</div>
	);
}
