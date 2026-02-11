import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { templates } from "@/dialogs/resume/template/data";

export const Route = createFileRoute("/_home/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const templateEntries = Object.entries(templates);
	const itemsPerPage = 3;
	const totalPages = Math.ceil(templateEntries.length / itemsPerPage);

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
	};

	const visibleTemplates = templateEntries.slice(
		currentIndex * itemsPerPage,
		currentIndex * itemsPerPage + itemsPerPage,
	);
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 font-sans">
			{/* Hero Section */}
			<div className="mx-auto max-w-7xl px-6 py-16">
				{/* Powered by Badge */}
				<div className="mb-8">
					<div
						className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm"
						style={{ backgroundColor: "#E2E8F0" }}
					>
						<img src="/src/dialogs/resume/zoe-talking.png" alt="Zoe AI" className="h-8 w-6 rounded-full" />
						<span className="font-medium text-gray-700 text-sm">Powered by Zoe AI Assistant</span>
					</div>
				</div>

				<div className="grid items-start gap-12 lg:grid-cols-2">
					{/* Left Content */}
					<div>
						<h1 className="mb-6 font-bold text-5xl text-gray-900 leading-tight lg:text-6xl">
							Create a Resume
							<br />
							That <span className="text-emerald-600">Gets You Hired</span>
						</h1>

						<p className="mb-8 text-gray-600 text-lg leading-relaxed">
							Build a professional resume in minutes with our intuitive editor. Get AI-powered suggestions and choose
							from beautiful templates.
						</p>

						{/* CTA Buttons */}
						<div className="mb-10 flex flex-wrap gap-4">
							<Link
								to="/dashboard/resumes"
								className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 font-medium text-white shadow-emerald-600/30 shadow-lg transition-all hover:bg-emerald-700"
							>
								<svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								Create Your Resume
								<svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</Link>

							<button className="rounded-lg border border-gray-300 bg-white px-6 py-3.5 font-medium text-gray-700 transition-all hover:bg-gray-50">
								View Templates
							</button>
						</div>

						{/* Rating */}
						<div className="flex flex-wrap items-center gap-3">
							<div className="flex gap-1">
								{[1, 2, 3, 4, 5].map((star) => (
									<svg key={star} className="size-5 fill-emerald-600" viewBox="0 0 20 20">
										<path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
									</svg>
								))}
							</div>
							<span className="font-semibold text-gray-900">4.9/5</span>
							<span className="text-gray-600">10,000+ resumes created</span>
						</div>
					</div>

					{/* Right Content - Resume Preview */}
					<div className="relative mt-8 lg:mt-0">
						<div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-8 shadow-2xl lg:p-12">
							{/* Resume Document */}
							<div className="rotate-3 transform rounded-lg bg-white shadow-xl transition-transform duration-300 hover:rotate-0">
								<div className="p-6 lg:p-8">
									<div className="mb-4">
										<h3 className="font-bold text-lg lg:text-xl">GIAN MAKER</h3>
										<p className="text-gray-600 text-xs lg:text-sm">Professional Title</p>
									</div>

									<div className="mb-4 space-y-3">
										<div className="h-2 w-3/4 rounded bg-gray-200"></div>
										<div className="h-2 w-full rounded bg-gray-200"></div>
										<div className="h-2 w-5/6 rounded bg-gray-200"></div>
									</div>

									<div className="mb-3">
										<div className="mb-2 h-3 w-1/3 rounded bg-gray-800"></div>
										<div className="mb-1 h-2 w-full rounded bg-gray-200"></div>
										<div className="h-2 w-4/5 rounded bg-gray-200"></div>
									</div>

									<div className="mb-3">
										<div className="mb-2 h-3 w-2/5 rounded bg-gray-800"></div>
										<div className="mb-1 h-2 w-full rounded bg-gray-200"></div>
										<div className="h-2 w-3/4 rounded bg-gray-200"></div>
									</div>

									<div>
										<div className="mb-2 h-3 w-1/4 rounded bg-gray-800"></div>
										<div className="mb-1 h-2 w-full rounded bg-gray-200"></div>
										<div className="h-2 w-5/6 rounded bg-gray-200"></div>
									</div>
								</div>
							</div>

							{/* AI Assistant Tooltip */}
							<div className="absolute -bottom-4 left-4 max-w-xs rounded-xl bg-white p-4 shadow-2xl lg:bottom-0 lg:left-0">
								<div className="flex items-start gap-3">
									<img src="/src/dialogs/resume/zoe-talking.png" alt="Zoe AI" className="h-8 w-8 rounded-full" />
									<div>
										<p className="mb-1 font-semibold text-gray-900 text-sm">Zoe says:</p>
										<p className="text-gray-600 text-sm">"Great job! Your resume is 85% optimized."</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* How It Works Section */}
			<div style={{ backgroundColor: "#E2E8F080" }} className="py-16 lg:py-20">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-12 text-center lg:mb-16">
						<h2 className="mb-4 font-bold text-3xl text-gray-900 lg:text-4xl">How It Works</h2>
						<p className="text-base text-gray-600 lg:text-lg">Create your professional resume in three simple steps</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3 lg:gap-12">
						{/* Step 1 */}
						<div className="relative text-center">
							<div className="mb-6 flex justify-center">
								<div className="font-bold text-5xl lg:text-6xl" style={{ color: "#05946733" }}>
									01
								</div>
							</div>
							<svg
								className="mx-auto mb-4 hidden size-6 text-emerald-600 md:absolute md:top-12 md:right-0 md:block"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
							<h3 className="mb-3 font-bold text-gray-900 text-lg lg:text-xl">Fill in your details</h3>
							<p className="text-gray-600">Enter your information in our guided forms</p>
						</div>

						{/* Step 2 */}
						<div className="relative text-center">
							<div className="mb-6 flex justify-center">
								<div className="font-bold text-5xl lg:text-6xl" style={{ color: "#05946733" }}>
									02
								</div>
							</div>
							<svg
								className="mx-auto mb-4 hidden size-6 text-emerald-600 md:absolute md:top-12 md:right-0 md:block"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
							<h3 className="mb-3 font-bold text-gray-900 text-lg lg:text-xl">Choose a template</h3>
							<p className="text-gray-600">Pick from our professional designs</p>
						</div>

						{/* Step 3 */}
						<div className="text-center">
							<div className="mb-6 flex justify-center">
								<div className="font-bold text-5xl lg:text-6xl" style={{ color: "#05946733" }}>
									03
								</div>
							</div>
							<h3 className="mb-3 font-bold text-gray-900 text-lg lg:text-xl">Download & apply</h3>
							<p className="text-gray-600">Export and start applying to jobs</p>
						</div>
					</div>
				</div>
			</div>

			{/* Beautiful Templates Section */}
			<div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
				<div className="mb-12 text-center lg:mb-16">
					<h2 className="mb-4 font-bold text-3xl text-gray-900 lg:text-4xl">Beautiful Templates</h2>
					<p className="text-base text-gray-600 lg:text-lg">
						Choose from our collection of {templateEntries.length} professionally designed resume templates
					</p>
				</div>

				{/* Template Carousel */}
				<div className="relative">
					{/* Left Arrow */}
					<button
						onClick={handlePrev}
						className="absolute top-1/2 left-0 z-10 hidden size-10 -translate-x-6 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 lg:flex"
					>
						<svg className="size-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					{/* Templates Grid */}
					<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
						{visibleTemplates.map(([key, template]) => (
							<div key={key} className="group cursor-pointer">
								<div className="rounded-xl border-2 border-transparent bg-white p-4 shadow-lg transition-all hover:border-emerald-600 hover:shadow-2xl lg:p-6">
									<div className="mb-4 aspect-[8.5/11] overflow-hidden rounded-lg bg-gray-100">
										<img
											src={template.imageUrl}
											alt={template.name}
											className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
										/>
									</div>
									<div className="text-center">
										<h3 className="mb-1 font-bold text-gray-900">{template.name}</h3>
										<p className="text-gray-600 text-sm">{template.tags.slice(0, 2).join(", ")}</p>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Right Arrow */}
					<button
						onClick={handleNext}
						className="absolute top-1/2 right-0 z-10 hidden size-10 translate-x-6 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 lg:flex"
					>
						<svg className="size-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>

				{/* Pagination Dots */}
				<div className="mt-8 flex justify-center gap-2">
					{Array.from({ length: totalPages }).map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`size-2.5 rounded-full transition-all ${
								index === currentIndex ? "w-8 bg-emerald-600" : "bg-gray-300 hover:bg-gray-400"
							}`}
							aria-label={`Go to page ${index + 1}`}
						/>
					))}
				</div>
			</div>

			{/* Everything You Need Section */}
			<div style={{ backgroundColor: "#E2E8F080" }} className="py-16 lg:py-20">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-12 text-center lg:mb-16">
						<h2 className="mb-4 font-bold text-3xl text-gray-900 lg:text-4xl">Everything You Need</h2>
						<p className="text-base text-gray-600 lg:text-lg">
							Our resume builder makes it easy to create, customize, and
							<br className="hidden sm:block" />
							download your perfect resume
						</p>
					</div>

					<div className="space-y-4">
						{/* Easy Section Editor - Full Width */}
						<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
							<div className="flex items-start gap-4">
								<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
									<svg className="size-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<h3 className="mb-2 font-bold text-gray-900 text-lg lg:text-xl">Easy Section Editor</h3>
									<p className="text-gray-600">
										Build your resume section by section with intuitive forms that guide you through every detail.
									</p>
								</div>
							</div>
						</div>

						{/* Two Column Grid */}
						<div className="grid gap-4 md:grid-cols-2">
							{/* Zoe AI Assistant */}
							<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
								<div className="flex items-start gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
										<svg className="size-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
									</div>
									<div className="flex-1">
										<h3 className="mb-2 font-bold text-gray-900 text-lg">Zoe AI Assistant</h3>
										<p className="text-gray-600 text-sm">
											Get smart suggestions from Zoe to make your content stand out and land more interviews.
										</p>
									</div>
								</div>
							</div>

							{/* 10+ Professional Templates */}
							<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
								<div className="flex items-start gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
										<svg className="size-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
											/>
										</svg>
									</div>
									<div className="flex-1">
										<h3 className="mb-2 font-bold text-gray-900 text-lg">10+ Professional Templates</h3>
										<p className="text-gray-600 text-sm">
											Choose from modern, classic, and creative designs crafted by professional designers.
										</p>
									</div>
								</div>
							</div>

							{/* Custom Sections */}
							<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
								<div className="flex items-start gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
										<svg className="size-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
											/>
										</svg>
									</div>
									<div className="flex-1">
										<h3 className="mb-2 font-bold text-gray-900 text-lg">Custom Sections</h3>
										<p className="text-gray-600 text-sm">
											Add any section you need—Awards, Languages, Publications, and more.
										</p>
									</div>
								</div>
							</div>

							{/* Export Anywhere */}
							<div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
								<div className="flex items-start gap-4">
									<div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
										<svg className="size-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
											/>
										</svg>
									</div>
									<div className="flex-1">
										<h3 className="mb-2 font-bold text-gray-900 text-lg">Export Anywhere</h3>
										<p className="text-gray-600 text-sm">
											Download as PDF or Word for any job application, ATS-optimized and ready to submit.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="border-gray-200 border-t bg-gray-50">
				<div className="mx-auto max-w-7xl px-6 py-8">
					<p className="text-center text-gray-600 text-sm">
						© 2024 Resume Builder. Create professional resumes with Zoe AI.
					</p>
				</div>
			</footer>
		</div>
	);
}
