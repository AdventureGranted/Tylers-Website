import Card from './Card';

const subjects = [
  'Object Oriented Programming',
  'Data Structures',
  'Algorithms',
  'Databases',
  'Web Development',
  'Mobile Development',
  'Agile Development',
  'Test Driven Development',
  'Pair Programming',
  'Computer Systems',
  'Distributed Systems',
  'Human-Computer Interaction',
  'Foundations of Data Analysis',
  'Computer Architecture',
  'Linear Algebra',
  'Statistics',
];

const languages = [
  'TypeScript',
  'JavaScript',
  'React.js',
  'Node.js',
  'C#',
  'Java',
  'C++',
  'Python',
  'Ruby on Rails',
  'Kotlin',
  'ASP.Net',
  'Jest',
  'RSpec',
];

const technologies = [
  'Ubuntu',
  'macOS',
  'Windows',
  'bash',
  'Zsh',
  'PowerShell',
  'Git',
  'Spring',
  'AWS',
  'Azure',
  'Kubernetes',
  'Docker',
  'Swagger',
  'Postman',
  'MySQL',
  'Salesforce',
  'Circle CI',
  'NewRelic',
  'Honeycomb',
  'Expo',
  'MongoDB',
];
export default function TechnicalSkills() {
  return (
    <div className="flex max-w-full flex-col xl:flex-row xl:gap-6">
      <Card title="Subjects">
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 text-lg text-gray-200 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="flex flex-col justify-center text-center"
            >
              {subject}
            </span>
          ))}
        </div>
      </Card>
      <Card title="Languages">
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-lg text-gray-200 md:grid-cols-2">
          {languages.map((lang) => (
            <span
              key={lang}
              className="flex flex-col justify-center text-center"
            >
              {lang}
            </span>
          ))}
        </div>
      </Card>
      <Card title="Technologies">
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-lg text-gray-200 md:grid-cols-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="flex flex-col justify-center text-center"
            >
              {tech}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
