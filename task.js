const fs = require("fs");

let inputArgs = process.argv.slice(2);

let command = inputArgs[0];

let taskList = readFileLines(`${process.cwd()}/task.txt`);
let doneList = readFileLines(`${process.cwd()}/completed.txt`);

let taskPriority = [];
// "add" command
function addNewTask() {
	let priority = inputArgs[1];
	let description = inputArgs[2];

	if (!priority || !description) {
		console.log("Error: Missing tasks string. Nothing added!");
		return;
	}
	if (taskPriority.includes(priority)) {
		console.log("Error: Task with the given priority already exist.");
		return;
	}
	taskPriority.push(priority);
	taskList.push(`${priority} ${description}`);
	sortTask(taskList);

	writeArrayToFile(taskList, "task.txt");
	console.log(`Added task: "${description}" with priority ${priority}`);
}

// "ls" command
function showIncompleteTask() {
	if (taskList.length == 0) {
		console.log("There are no pending tasks!");
		return;
	}
	let text = "";

	taskList.forEach((task, idx) => {
		let priority = task.substring(0, task.indexOf(" "));
		let description = task.substring(task.indexOf(" ") + 1);
		text += `${idx + 1}. ${description} [${priority}]\n`;
	});

	text = text.substring(0, text.length - 1);
	console.log(text);
}

// "del" command
function deleteTask() {
	let idx = inputArgs[1];
	if (!idx) {
		console.log("Error: Missing NUMBER for deleting tasks.");
		return;
	}
	if (idx < 1 || idx > taskList.length) {
		console.log(
			`Error: task with index #${idx} does not exist. Nothing deleted.`
		);
		return;
	}
	taskList.splice(idx - 1, 1);
	writeArrayToFile(taskList, "task.txt");
	console.log(`Deleted task #${idx}`);
}

// "done" command
function markDone() {
	let idx = inputArgs[1];
	if (!idx) {
		console.log("Error: Missing NUMBER for marking tasks as done.");
		return;
	}
	if (idx < 1 || idx > taskList.length) {
		console.log(`Error: no incomplete item with index #${idx} exists.`);
		return;
	}
	let deletedItems = taskList.splice(idx - 1, 1);
	let deltedTask = deletedItems[0];
	doneList.push(deltedTask.substring(deltedTask.indexOf(" ") + 1)); // insert "buy milk" to doneList[]

	writeArrayToFile(taskList, "task.txt");
	writeArrayToFile(doneList, "completed.txt");
	console.log("Marked item as done.");
}

// "report" command
function showReport() {
	let text = `Pending : ${taskList.length}\n`;

	taskList.forEach((task, idx) => {
		let p = task.substring(0, task.indexOf(" "));
		let d = task.substring(task.indexOf(" ") + 1);
		text += `${idx + 1}. ${d} [${p}]\n`;
	});
	text += `\nCompleted : ${doneList.length}\n`;
	doneList.forEach((task, idx) => {
		text += `${idx + 1}. ${task}\n`;
	});

	text = text.substring(0, text.length - 1); // remove last '\n' character

	console.log(text);
}

// "help" command
function help() {
	let helpText = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text \"hello world\" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;
	console.log(helpText);
}

switch (command) {
	case "add":
		addNewTask();
		break;
	case "ls":
		showIncompleteTask();
		break;
	case "del":
		deleteTask();
		break;
	case "done":
		markDone();
		break;
	case "report":
		showReport();
		break;
	default:
		help();
}

// reads file content line-by-line and stores it in array
function readFileLines(filename) {
	try {
		let arr = fs.readFileSync(filename).toString("utf-8").split("\n");
		return arr.slice(0, arr.length - 1);
	} catch (err) {
		return [];
	}
}

// writes array content to text files
function writeArrayToFile(arr, filename) {
	let content = "";
	arr.forEach((task) => {
		content += task + "\n";
	});
	fs.writeFileSync(filename, content, function (err) {
		if (err) throw err;
	});
}

// sort the tasks by its priority
function sortTask(list) {
	list.sort((a, b) => compare(a, b));
}

function compare(a, b) {
	let p1 = a.substr(0, a.indexOf(" "));
	let p2 = b.substr(0, b.indexOf(" "));
	return p1 - p2;
}
