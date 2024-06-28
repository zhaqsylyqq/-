const Course = ({ course }) => {
	const Header = () => <h1>{course.name}</h1>;

	const Part = ({ name, exercises }) => (
		<p>
			{name} {exercises}
		</p>
	);

	const Content = ({ parts }) => (
		<>
			{parts.map(part => (
				<Part key={part.id} name={part.name} exercises={part.exercises} />
			))}
		</>
	);

	const Total = ({ parts }) => {
		const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
		return <h3>total of {totalExercises} exercises</h3>;
	};

	return (
		<>
			<Header />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</>
	);
};

export default Course;