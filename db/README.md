## 1. How to view the EER diagram?

Install `MySQL Workbench` and open the mwb file.

## 2. How could I generate SQL script from the db model?

In MySQL Workbench, `File -> Export -> Forward Engineer SQL Script`

then check

* Generate DROP Statements Before Each CREATE Statement
* Generate DROP SCHEMA
* Sort Tables Alphabetically

You may also consider setting `Model -> Target MYSQL Version` to `5.7`, for compatibility, if later decided to go with `MariaDB` instead of the `MySQL Community Edition`.

The `exported.sql` in this folder is an exported sql script file.

## 3. How to run the test script and get the output?

**THIS WILL DROP AND CREATE THE DATABASE**

In bash/zsh, do

```{bash}
sudo mysql <drop_if_exists.sql && sudo mysql <setup_db_and_tables.sql && sudo mysql <test-sample.sql >test-sample.out
```
