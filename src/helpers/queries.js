const queries = ```
SELECT column1, column2
FROM table_name;

SELECT * FROM Customers
WHERE Country='Mexico';

SELECT column1, column2, ...
FROM table_name
WHERE condition1 AND condition2 AND condition3 ...;

SELECT * FROM Customers
WHERE Country='Germany' OR Country='Spain';

SELECT * FROM Customers
WHERE Country='Germany' AND (City='Berlin' OR City='München');


SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
FROM Orders
INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
```;
