CREATE DATABASE 'ecom_smart_kade';

CREATE TABLE Admin (
    AdminID VARCHAR(255) PRIMARY KEY,
    FirstName VARCHAR(25),
    LastName VARCHAR(25),
    Email VARCHAR(50),
    PhoneNumber CHAR(10),
    Role VARCHAR(10),
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
    BatchID VARCHAR(255) PRIMARY KEY,
    ProductID VARCHAR(255),
    Stock_Quantity INT NOT NULL,
    Buying_Price DECIMAL(10, 2) NOT NULL,
    Selling_Price DECIMAL(10, 2) NOT NULL,
    Date DATE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);