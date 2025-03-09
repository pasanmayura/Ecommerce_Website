CREATE DATABASE 'ecom_smart_kade';

CREATE TABLE Admin (
    AdminID VARCHAR(255) PRIMARY KEY,
    FirstName VARCHAR(25),
    LastName VARCHAR(25),
    Email VARCHAR(50),
    PhoneNumber CHAR(10),
    Role VARCHAR(10) DEFAULT 'Worker',
    Password VARCHAR(255)
);

CREATE TABLE Category (
    CategoryID VARCHAR(255) PRIMARY KEY,
    Category_Name VARCHAR(255) NOT NULL,
    AdminID VARCHAR(255), 
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID) 
);

CREATE TABLE Product (
    ProductID VARCHAR(255) PRIMARY KEY,
    Product_Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Threshold INT NOT NULL,
    AdminID VARCHAR(255), 
    CategoryID VARCHAR(255),         
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

CREATE TABLE ProductsImages (
    ImageID INT PRIMARY KEY Auto_increment,
    ProductID VARCHAR(255),
    ImageURL_1 VARCHAR(255),
    ImageURL_2 VARCHAR(255),
    ImageURL_3 VARCHAR(255),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

CREATE TABLE Batch (
    BatchID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID VARCHAR(255),
    Stock_Quantity INT NOT NULL,
    Buying_Price DECIMAL(10, 2) NOT NULL,
    Selling_Price DECIMAL(10, 2) NOT NULL,
    Date DATE DEFAULT (CURRENT_DATE),
    IsDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

CREATE TABLE Customer (
    CustomerID VARCHAR(255) PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    MobileNumber VARCHAR(20) NOT NULL,
    Password VARCHAR(255) NOT NULL,  
    Street_No VARCHAR(50),
    Village VARCHAR(255),
    City VARCHAR(255),
    Postal_Code VARCHAR(20)
);

CREATE TABLE OrderTable (
    OrderID VARCHAR(255) PRIMARY KEY,
    Total_Amount DECIMAL(10, 2),
    PaymentStatus ENUM('Paid', 'Pending'),
    OrderDate DATE DEFAULT (CURRENT_DATE),
    OrderStatus ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    CustomerID VARCHAR(255),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE ProductOrder (
    OrderID VARCHAR(255),
    ProductID VARCHAR(255),
    BatchID INT, 
    Quantity INT,
    PRIMARY KEY (OrderID, ProductID, BatchID),  
    FOREIGN KEY (OrderID) REFERENCES ordertable(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    FOREIGN KEY (BatchID) REFERENCES Batch(BatchID) 
);

CREATE TABLE OrderReturns (
    OrderReturnID VARCHAR(255) PRIMARY KEY,
    Reason VARCHAR(255),  
    CustomerID VARCHAR(255),
    OrderID VARCHAR(255),  
    OrderReturnDate DATE DEFAULT (CURRENT_DATE),
    ReturnStatus ENUM('Pending', 'Approved', 'Rejected', 'Completed'),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)  
);