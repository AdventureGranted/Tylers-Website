import React from "react";
import ProfileCard from "./components/ProfileCard";
import Card from "./components/Card";

export default function Home() {
  return (
    <main className="p-6 md:p-24">
      <div className="">
        <ProfileCard />
        <div className="flex  flex-col xl:flex-row mt-8 max-w-full mx- gap-10  font-bold">
          <Card title="Subjects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-200 text-lg mt-6">
              <span className="flex flex-col justify-center text-center">
                Object Oriented Programming
              </span>
              <span className="flex flex-col justify-center text-center">
                Data Structures
              </span>
              <span className="flex flex-col justify-center text-center">
                Algorithms
              </span>
              <span className="flex flex-col justify-center text-center">
                Databases
              </span>
              <span className="flex flex-col justify-center text-center">
                Web/Mobile Development
              </span>
              <span className="flex flex-col justify-center text-center">
                Agile Development
              </span>
              <span className="flex flex-col justify-center text-center">
                Test Driven Development
              </span>
              <span className="flex flex-col justify-center text-center">
                Pair Programming
              </span>
              <span className="flex flex-col justify-center text-center">
                Computer/Distributed Systems
              </span>
              <span className="flex flex-col justify-center text-center">
                Human-Computer Interaction
              </span>
              <span className="flex flex-col justify-center text-center">
                Foundations of Data Analysis
              </span>
              <span className="flex flex-col justify-center text-center">
                Computer Architecture
              </span>
              <span className="flex flex-col justify-center text-center">
                Linear Algebra
              </span>
              <span className="flex flex-col justify-center text-center">
                Statistics
              </span>
            </div>
          </Card>
          <Card title="Programming Languages">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-2 text-gray-200 text-lg mt-6">
              <span>TypeScript</span>
              <span>JavaScript</span>
              <span>React.js</span>
              <span>Node.js</span>
              <span>C#</span>
              <span>Java</span>
              <span>C++</span>
              <span>Python</span>
              <span>Ruby on Rails</span>
              <span>Kotlin</span>
              <span>ASP.Net</span>
              <span>Jest</span>
              <span>RSpec</span>
            </div>
          </Card>
          <Card title="Technologies">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-2 text-gray-200 text-lg mt-6">
              <span>Ubuntu</span>
              <span>macOS</span>
              <span>Windows</span>
              <span>bash</span>
              <span>zsh</span>
              <span>PowerShell</span>
              <span>Git</span>
              <span>Spring</span>
              <span>AWS/Azure</span>
              <span>Kubernetes</span>
              <span>Docker</span>
              <span>Swagger</span>
              <span>Postman</span>
              <span>MySQL</span>
              <span>Salesforce</span>
              <span>Circle CI</span>
              <span>NewRelic</span>
              <span>Honeycomb</span>
              <span>Expo</span>
              <span>MongoDB</span>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
