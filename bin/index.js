#! /usr/bin/env node
const fs = require("fs");

const args = process.argv.slice(2);

const command = args[0]; // command
const firstDes = args[1]; // first argument (e.g. id of task, description of task)
const secondDes = args[2]; // second argument (e.g. id of task, description of task)

// ----- LIST OF TASKS ----- //

if (command === "list") {           // Check if command is "list"

  // ----- List tasks with status "todo" ----- //
  if (firstDes === "todo") {
    if (fs.existsSync("./tasks.json")) {      // Verify if the tasks file exists
      fs.readFile("./tasks.json", "utf8", (err, data) => {        // Reading the file
        if (err) {
          console.log(err);           // Log any error that occur during file reading
          return;
        }
        let obj = JSON.parse(data);           // Parse the file content as JSON

        // Filter tasks that are marked as "todo"
        const todoList = obj.tasks.filter((task) => task.status === "todo");

        if (todoList.length === 0) {
          console.log("There are no tasks that are marked as 'todo'");
        }

        // Log each "todo" task's details
        for (let i = 0; i < todoList.length; i++) {
          console.log(
            `${todoList[i].id}. ${todoList[i].description} ( ${todoList[i].status} )`
          );
        }
      });
    } else {
      console.log("Tasks file does not exists!");          // Notify if the tasks file does not exists
    }
  }

  // ----- List tasks with status "done" ----- //
  else if (firstDes === "done") {
    if (fs.existsSync("./tasks.json")) {
      fs.readFile("./tasks.json", "utf8", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        let obj = JSON.parse(data);

        // Filter tasks that are marked as "done"
        const todoList = obj.tasks.filter((task) => task.status === "done");
        if (todoList.length === 0) {
          console.log("There are no tasks that are marked as 'done'");
        }

        // Log each "done" task's details
        for (let i = 0; i < todoList.length; i++) {
          console.log(
            `${todoList[i].id}. ${todoList[i].description} ( ${todoList[i].status} )`
          );
        }
      });
    } else {
      console.log("Tasks file does not exists!");           // Notify if the tasks file does not exists
    }
  }

  // ----- List tasks with status "in-progress" ----- //
  else if (firstDes === "in-progress") {
    if (fs.existsSync("./tasks.json")) {
      fs.readFile("./tasks.json", "utf8", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        let obj = JSON.parse(data);

        // Filter tasks that are marked as "in-progress"
        const todoList = obj.tasks.filter(
          (task) => task.status === "in-progress"
        );

        if (todoList.length === 0) {
          console.log("There are no tasks that are marked as 'in-progress'");
        }

        // Log each "in-progress" task's details
        for (let i = 0; i < todoList.length; i++) {
          console.log(
            `${todoList[i].id}. ${todoList[i].description} ( ${todoList[i].status} )`
          );
        }
      });
    } else {
      console.log("Tasks file does not exists!");
    }
  }

  // ----- List all tasks if no specific status is provided ----- //
  else {
    if (fs.existsSync("./tasks.json")) {
      fs.readFile("./tasks.json", "utf8", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        let obj = JSON.parse(data);

        // Check if there are any tasks available
        if (obj.tasks && obj.tasks.length > 0) {
          console.log("Tasks list:");

          // Log details for each task
          for (let i = 0; i < obj.tasks.length; i++) {
            console.log(
              obj.tasks[i].id +
                ". " +
                obj.tasks[i].description +
                " ( " +
                obj.tasks[i].status +
                " )"
            );
          }
        } else {
          console.log("There are no tasks!");         // Notify if no tasks are found
        }
      });
    } else {
      console.log("Tasks file does not exists!");
    }
  }
}

if (command === "add") {                     // Check if command is "list"
  if (firstDes === undefined) {               // Check if there is description, if not then throws message
    console.log("Missing description");
    return;
  }
  if (fs.existsSync("./tasks.json")) {        // Verify if the tasks file exists
    fs.readFile("./tasks.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      let obj = JSON.parse(data);
      if (!obj.tasks) {
        obj.tasks = [];
      }

      // Maps all Ids of tasks to new array
      const allIds = obj.tasks.map((task) => task.id);
      let newId = 1;

                                                  // Checks if "newId" exists in "allIds", if not, that means there is a missing Id to be fullfilled,
      while (allIds.includes(newId)) {            //  otherwise "newId" increases and repeat until empty Id is found 
        newId++;
      }
      obj.tasks.push({                            // Creates task
        id: newId,
        description: firstDes,
        status: "todo",
        createdAt: new Date().toISOString(),
      });
      obj.tasks.sort((a, b) => a.id - b.id);      // sorting tasks by their's Id
      const json = JSON.stringify(obj);           // Convert the 'obj' JavaScript object into a JSON string
      fs.writeFile("./tasks.json", json, () => {});         // Writes task to JSON file (tasks.json)
    });
  } else {                     // if file (tasks.json) doesn't exists, then creates
    const obj = {
      tasks: [
        {
          id: 1,
          description: firstDes,
          status: "todo",
          createdAt: new Date().toISOString(),
        },
      ],
    };
    const json = JSON.stringify(obj);
    fs.writeFile("./tasks.json", json, () => {});
  }
}

if (command === "update") {
  if (firstDes === undefined) {               // Check if there is Id, if not then throws message
    console.log("Missing Id");
    return;
  }
  if (secondDes === undefined) {               // Check if there is description, if not then throws message
    console.log("Missing description");
    return;
  }
  if (fs.existsSync("./tasks.json")) {
    fs.readFile("./tasks.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      let obj = JSON.parse(data);

      // console.log(obj.tasks);
      const taskIndex = obj.tasks.findIndex(
        (task) => task.id === Number(firstDes)
      );

      if (taskIndex === -1) {
        console.log("Id for that task does not exists!");
        return;
      }

      obj.tasks[taskIndex].description = secondDes;                   // Updates description of task
      obj.tasks[taskIndex].updatedAt = new Date().toISOString();      // Creates "updatedAt" for the task
      const json = JSON.stringify(obj);
      fs.writeFile("./tasks.json", json, () => {});
    });
  } else {
    console.log("Tasks file does not exists!");
  }
}

if (command === "delete") {
  if (firstDes === undefined) {               // Check if there is description, if not then throws message
    console.log("Missing Id");
    return;
  }
  if (fs.existsSync("./tasks.json")) {
    fs.readFile("./tasks.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      let obj = JSON.parse(data);

      const taskIndex = obj.tasks.findIndex(
        (task) => task.id === Number(firstDes)
      );

      if (taskIndex === -1) {
        console.log("Id for that task does not exists!");
        return;
      }

      // Deletes specific task
      obj.tasks.splice(taskIndex, 1);
      const json = JSON.stringify(obj);
      fs.writeFile("./tasks.json", json, () => {});
    });
  } else {
    console.log("Tasks file does not exists!");
  }
}

if (command === "mark-in-progress") {
  if (firstDes === undefined) {
    console.log("Missing Id");
    return;
  }
  if (fs.existsSync("./tasks.json")) {
    fs.readFile("./tasks.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      let obj = JSON.parse(data);

      const taskIndex = obj.tasks.findIndex(
        (task) => task.id === Number(firstDes)
      );
      obj.tasks[taskIndex].status = "in-progress";              // Sets status for the task to "in-progress"

      const json = JSON.stringify(obj);
      fs.writeFile("./tasks.json", json, () => {});
    });
  } else {
    console.log("Tasks file does not exists!");
  }
}

if (command === "mark-done") {
  if (firstDes === undefined) {
    console.log("Missing Id");
    return;
  }
  if (fs.existsSync("./tasks.json")) {
    fs.readFile("./tasks.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      let obj = JSON.parse(data);

      const taskIndex = obj.tasks.findIndex(
        (task) => task.id === Number(firstDes)
      );
      obj.tasks[taskIndex].status = "done";              // Sets status for the task to "done"

      const json = JSON.stringify(obj);
      fs.writeFile("./tasks.json", json, () => {});
    });
  } else {
    console.log("Tasks file does not exists!");
  }
}
