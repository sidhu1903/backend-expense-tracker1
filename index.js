const mysql = require("mysql");
const express = require("express");
const bodyparser = require("body-parser");
var app = express();
const cors=require("cors");

app.use(bodyparser.json());
app.use(cors());

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "niveddb",
  password: "abc",
  database: "expense_track",
  multipleStatements: true
});

mysqlConnection.connect((err) => {
  if (!err) console.log("Connection Established Successfully");
  else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.get("/expense_track/users", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM users",
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

app.get("/expense_track/users/:id", (req, res) => {
    mysqlConnection.query(
      "SELECT * FROM users WHERE user_id = ?",
      [req.params.id],
      (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
  });

  app.get("/expense_track/expense/:id", (req, res) => {
    mysqlConnection.query(
      "SELECT * FROM expense e,users u WHERE u.user_id = ?",
      [req.params.id],
      (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
  });

  app.get("/expense_track/expected_expense/:id", (req, res) => {
    mysqlConnection.query(
      "SELECT * FROM expected_expense e,users u WHERE u.user_id = ? and u.user_id=e.users_id",
      [req.params.id],
      (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
  });

  app.get("/expense_track/expense_type/:id", (req, res) => {
    mysqlConnection.query(
      "select expense_type.expense_id,expense_type.expense_type,expense_type.expense_desc from expense_type inner join expense on expense.expense_id=expense_type.expense_id;",
      [req.params.id],
      (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
  });

  app.post("/expense_track/income", (req, res) => {
    mysqlConnection.query(
      "SELECT * FROM income i,users u WHERE u.user_id = ? and u.user_id=i.uid",
      [req.body.id],
      (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
  });

app.post("/expense_track/users/login", (req, res) => {
    let exp=req.body;
    mysqlConnection.query(
      "SELECT * FROM users WHERE user_name = ? AND user_password = ?",
      [exp.user_name,exp.user_password],
      (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
  });

app.post("/expense_track/users/register", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @user_id = ?;SET @user_name = ?;SET @user_password = ?; CALL userAddOrEdit(@user_id,@user_name,@user_password);";
  mysqlConnection.query(
    sql,
    [exp.user_id, exp.user_name, exp.user_password],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
          {
            if(element[0].user_id==0)
            res.send("User already exists");
            else
            res.send("New User ID : " + element[0].user_id);
          }
        });
      else console.log(err);
    }
  );
});

app.post("/expense_track/expense_type/:id", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @expense_id = ?;SET @expense_type= ?;SET @expense_desc = ?; CALL expenseTypeAddOrEdit(@expense_id,@expense_type,@expense_desc);";
  mysqlConnection.query(
    sql,
    [exp.expense_id, exp.expense_type, exp.expense_desc],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
          {
            if(element[0].expense_id==0)
            res.send("Expense type already exists");
            else
            res.send("New Expense ID : " + element[0].expense_id);

            console.log(element);
          }
        });
      else console.log(err);
    }
  );
});

app.post("/expense_track/expense/:id", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @expense_id = ?;SET @expense_name= ?;SET @expense_amount = ?;SET @user_id = ?; CALL expensesAddOrEdit(@expense_id,@expense_name,@expense_amount,@user_id);";
  mysqlConnection.query(
    sql,
    [exp.expense_id, exp.expense_name, exp.expense_amount,exp.user_id],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
          {
            if(element[0].expense_id==0)
            res.send("Expense already exists");
            else
            res.send("New Expense ID : " + element[0].expense_id);

            console.log(element);
          }
        });
      else console.log(err);
    }
  );
});

app.post("/expense_track/expected_expense/:id", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @expenses_id = ?;SET @expense_name= ?;SET @expected_amount = ?;SET @users_id = ?; CALL expectedExpensesAddOrEdit(@expenses_id,@expense_name,@expected_amount,@users_id);";
  mysqlConnection.query(
    sql,
    [exp.expenses_id, exp.expense_name, exp.expected_amount,exp.users_id],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
          {
            if(element[0].expense_id==0)
            res.send("Expected expense already exists");
            else
            res.send("New Expense ID : " + element[0].expense_id);

            console.log(element);
          }
        });
      else console.log(err);
    }
  );
});

app.post("/expense_track/income/:id", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @income_id = ?;SET @income_name= ?;SET @income_amount = ?;SET @uid = ?; CALL incomeAddOrEdit(@income_id,@income_name,@income_amount,@uid);";
  mysqlConnection.query(
    sql,
    [exp.income_id, exp.income_name, exp.income_amount,exp.uid],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
          {
            if(element[0].income_id==0)
            res.send("Income already exists");
            else
            res.send("New Income ID : " + element[0].income_id);

            console.log(element);
          }
        });
      else console.log(err);
    }
  );
});

app.put("/expense_track", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @user_id = ?;SET @user_name = ?;SET @user_expense = ?; CALL expenseAddOrEdit(@user_id,@user_name,@user_expense);";
  mysqlConnection.query(
    sql,
    [exp.user_id, exp.user_name, exp.user_expense],
    (err, rows, fields) => {
      if (!err) res.send("User Details Updated Successfully");
      else console.log(err);
    }
  );
});

app.put("/expense_track/expense_type/:id", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @expense_id = ?;SET @expense_type = ?;SET @expense_desc = ?; CALL expenseTypeAddOrEdit(@expense_id,@expense_type,@expense_desc);";
  mysqlConnection.query(
    sql,
    [exp.expense_id, exp.expense_type, exp.expense_desc],
    (err, rows, fields) => {
      if (!err) res.send("Expense Details Updated Successfully");
      else console.log(err);
    }
  );
});

app.put("/expense_track/expense/:id", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @expense_id = ?;SET @expense_name = ?;SET @expense_amount = ?;SET @user_id = ?; CALL expensesAddOrEdit(@expense_id,@expense_name,@expense_amount,@user_id);";
  mysqlConnection.query(
    sql,
    [exp.expense_id, exp.expense_name, exp.expense_amount, exp.user_id],
    (err, rows, fields) => {
      if (!err) res.send("Expense Details Updated Successfully");
      else console.log(err);
    }
  );
});

app.put("/expense_track/expected_expense/:id", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @expenses_id = ?;SET @expense_name = ?;SET @expected_amount = ?;SET @users_id = ?; CALL expectedExpensesAddOrEdit(@expenses_id,@expense_name,@expected_amount,@users_id);";
  mysqlConnection.query(
    sql,
    [exp.expenses_id, exp.expense_name, exp.expected_amount, exp.users_id],
    (err, rows, fields) => {
      if (!err) res.send("Expected expense Details Updated Successfully");
      else console.log(err);
    }
  );
});

app.put("/expense_track/income/:id", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @income_id = ?;SET @income_name = ?;SET @income_amount = ?;SET @uid = ?; CALL incomeAddOrEdit(@income_id,@income_name,@income_amount,@uid);";
  mysqlConnection.query(
    sql,
    [exp.income_id, exp.income_name, exp.income_amount, exp.uid],
    (err, rows, fields) => {
      if (!err) res.send("Income Details Updated Successfully");
      else console.log(err);
    }
  );
});

// app.delete("/expense_track/:id", (req, res) => {
//   mysqlConnection.query(
//     "DELETE FROM expense WHERE user_id = ?",
//     [req.params.id],
//     (err, rows, fields) => {
//       if (!err) res.send("User Record deleted successfully.");
//       else console.log(err);
//     }
//   );
// });

app.delete("/expense_track/users/:id", (req, res) => {
    mysqlConnection.query(
      "DELETE FROM users WHERE user_id = ?",
      [req.params.id],
      (err, rows, fields) => {
        if (!err) res.send("User Record deleted successfully.");
        else console.log(err);
      }
    );
  });

  app.delete("/expense_track/expense_type/:uid/:eid", (req, res) => {
    console.log(req.params);
    mysqlConnection.query(
      "DELETE FROM expense_type WHERE expense_id = ?",
      [req.params.eid],
      (err, rows, fields) => {
        if (!err) res.send("User Record deleted successfully.");
        else console.log(err);
      }
    );
  });

  app.delete("/expense_track/expected_expense/:uid/:eid", (req, res) => {
    console.log(req.params);
    mysqlConnection.query(
      "DELETE FROM expected_expense WHERE expenses_id = ?",
      [req.params.eid],
      (err, rows, fields) => {
        if (!err) res.send("User Record deleted successfully.");
        else console.log(err);
      }
    );
  });

  app.delete("/expense_track/expense/:uid/:eid", (req, res) => {
    console.log(req.params);
    mysqlConnection.query(
      "DELETE FROM expense WHERE expense_id = ?",
      [req.params.eid],
      (err, rows, fields) => {
        if (!err) res.send("User Record deleted successfully.");
        else console.log(err);
      }
    );
  });

  app.delete("/expense_track/income/:uid/:eid", (req, res) => {
    console.log(req.params);
    mysqlConnection.query(
      "DELETE FROM income WHERE income_id = ?",
      [req.params.eid],
      (err, rows, fields) => {
        if (!err) res.send("User Record deleted successfully.");
        else console.log(err);
      }
    );
  });
