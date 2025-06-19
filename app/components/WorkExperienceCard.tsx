import Image from "next/image";
import React from "react";

const experiences = [
	{
		company: "Sorenson Communications",
		role: "Software Engineer",
		date: "Dec 2022 - July 3, 2025",
		logo: "/sorensonCommunications.jpg",
		logoAlt: "Sorenson Communications Logo",
		bullets: [
			"Designed and deployed a full-stack, real-time ASL interpretation platform using React, Node.js, AWS (Lambda, DynamoDB), and Netlify",
			"Enabled in-store QR-based access to interpreters for deaf and hard-of-hearing users, enhancing accessibility in retail environments",
			"Implemented dynamic geofencing and automated billing logic to support location-aware access and accurate usage tracking",
			"Built an SSO-enabled bypass flow to extend service access outside geofenced areas as an enterprise accessibility benefit",
			"Improved user experience with a responsive, mobile-friendly frontend and seamless authentication flow",
		],
	},
	{
		company: "University of Utah",
		role: "Teaching Assistant",
		date: "Spring 2021 - Fall 2022",
		logo: "/uofu.svg",
		logoAlt: "University of Utah Logo",
		bullets: [
			"Led office hours, lab sessions, and review events to support over 100 students in Data Structures, Algorithms, and Software Engineering courses",
			"Graded assignments and provided detailed technical feedback to reinforce core computer science concepts",
			"Served as a retention TA, offering additional support to students at risk of dropping courses, contributing to improved course completion rates",
		],
	},
	{
		company: "Kantata",
		role: "Software Engineer Intern",
		date: "Dec 2022 - July 3, 2025",
		logo: "/kantata.png",
		logoAlt: "Kantata Logo",
		bullets: [
			"Collaborated with 4 interns to build admin panel features in Ruby on Rails and React, including a secure user impersonation tool to enhance QA",
			"Integrated Salesforce and Slack into the product ecosystem, simplifying customer workflows",
			"Practiced test-driven development, pair programming, and CI/CD under mentorship from senior engineers",
		],
	},
	{
		company: "Zions Bank",
		role: "Software Engineer Intern",
		date: "Dec 2022 - July 3, 2025",
		logo: "/zionsBank.jpg",
		logoAlt: "Zions Bank Logo",
		bullets: [
			"Modernized UI components using Salesforce, JavaScript, and CSS, improving design consistency and usability",
			"Automated redaction of PII from financial documents, saving manual processing time and increasing compliance",
		],
	},
	// Add more experiences here...
];

export default function WorkExperienceCard() {
	return (
		<div className="max-w-full bg-gray-800 rounded-4xl shadow-md mt-8">
			<h1 className="text-3xl font-bold text-center text-gray-200 pt-8">
				Work Experience
			</h1>
			<div className="w-1/2 xl:w-1/4 h-1 bg-gray-400 rounded mx-auto mt-2 mb-2" />
			<div className="overflow-hidden flex flex-col items-start p-6 mt-4 gap-8">
				{experiences.map((exp) => (
					<div
						key={exp.company}
						className="flex flex-col h-full w-full text-left"
					>
						<div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full">
							<div className="flex flex-row items-center">
								<h1 className="text-2xl text-left">{exp.company}</h1>
								<h2 className="text-left ml-2 text-md">- {exp.role}</h2>
							</div>
							<h2 className="text-right text-xl whitespace-nowrap">
								{exp.date}
							</h2>
						</div>
						<div className="w-full h-px bg-gray-400 my-2" />
						<div className="flex flex-col lg:flex-row items-center lg:items-start w-full mt-4">
							<Image
								src={exp.logo}
								alt={exp.logoAlt}
								width={240}
								height={240}
							/>
							<ul className="ml-8 list-disc text-xl p-4 space-y-2">
								{exp.bullets.map((b, i) => (
									<li key={i}>{b}</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
