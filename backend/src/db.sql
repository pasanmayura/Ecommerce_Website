CREATE DATABASE ecom_smart_kade;

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
    Product_Rating FLOAT DEFAULT 0,
    Rating_Count INT DEFAULT 0,
    Total_Rating INT DEFAULT 0,       
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

CREATE TABLE Orders (
    OrderID VARCHAR(255) PRIMARY KEY,
    Total_Amount DECIMAL(10, 2),
    PaymentStatus ENUM('Paid', 'Pending', 'Cancelled'),
    PaymentMethod ENUM('COD', 'Stripe'),
    OrderDate DATE DEFAULT (CURRENT_DATE),
    OrderStatus ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Completed'),
    CustomerID VARCHAR(255),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE ProductOrders (
    OrderID VARCHAR(255),
    ProductID VARCHAR(255),
    BatchID INT, 
    Quantity INT,
    PRIMARY KEY (OrderID, ProductID, BatchID),  
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    FOREIGN KEY (BatchID) REFERENCES Batch(BatchID) 
);

CREATE TABLE Order_Returns (
    OrderReturnID VARCHAR(255) PRIMARY KEY,
    OrderID VARCHAR(255), 
    CustomerID VARCHAR(255),
    ReturnStatus ENUM('Pending', 'Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
    OrderReturnDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE CASCADE
);

CREATE TABLE Return_Items (
    ReturnItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderReturnID VARCHAR(255) NOT NULL,
    ProductID VARCHAR(255) NOT NULL,
    Quantity INT NOT NULL CHECK (quantity > 0),
    Reason VARCHAR(255) NOT NULL,
    FOREIGN KEY (OrderReturnID) REFERENCES Order_Returns(OrderReturnID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

CREATE TABLE product_review (
  ReviewID INT AUTO_INCREMENT PRIMARY KEY,
  ProductID VARCHAR(255),
  CustomerID VARCHAR(255),
  CustomerRating FLOAT DEFAULT 0,
  Comment VARCHAR(255),
  Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
  FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE Wishlist (
  WishlistID INT AUTO_INCREMENT PRIMARY KEY,
  CustomerID VARCHAR(255),
  ProductID VARCHAR(255),
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
  FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

--Views

-- Create a view to get low stock products
CREATE VIEW LowStockProducts AS
    SELECT 
        p.ProductID, 
        p.Product_Name, 
        p.Threshold,
        c.Category_Name,
        COALESCE(SUM(b.Stock_Quantity), 0) AS TotalStock
    FROM Product p
    LEFT JOIN Batch b ON p.ProductID = b.ProductID
    JOIN category c ON p.CategoryID = c.CategoryID
    GROUP BY p.ProductID, p.Product_Name, p.Threshold
    HAVING TotalStock < p.Threshold;

-- Create a view to get product details for display in cards
CREATE VIEW ProductDisplayView AS
SELECT 
    p.ProductID AS id,
    p.Product_Name AS name, 
    (
        SELECT b1.Selling_Price
        FROM Batch b1
        WHERE b1.ProductID = p.ProductID AND b1.Stock_Quantity > 0
        ORDER BY b1.Date ASC, b1.BatchID ASC
        LIMIT 1
    ) AS price,
    pi.ImageURL_1 AS image,
    p.Product_Rating AS rating,
    (
        SELECT COALESCE(SUM(po.Quantity), 0)
        FROM ProductOrders po
        WHERE po.ProductID = p.ProductID
    ) AS sold_count
FROM Product p
JOIN ProductsImages pi ON p.ProductID = pi.ProductID
GROUP BY p.ProductID, p.Product_Name, pi.ImageURL_1, p.Product_Rating;

-- ViewProdut Details 
CREATE VIEW ProductDetailsView AS
SELECT 
    p.ProductID AS id,
    p.Product_Name AS name,
    p.Description AS description,

    (
      SELECT b1.Selling_Price
      FROM Batch b1
      WHERE b1.ProductID = p.ProductID AND b1.Stock_Quantity > 0
      ORDER BY b1.Date ASC, b1.BatchID ASC
      LIMIT 1
    ) AS price,

    (
      SELECT b1.Stock_Quantity
      FROM Batch b1
      WHERE b1.ProductID = p.ProductID AND b1.Stock_Quantity > 0
      ORDER BY b1.Date ASC, b1.BatchID ASC
      LIMIT 1
    ) AS stock_quantity,

    p.Product_Rating AS rating,
    pi.ImageURL_1 AS image1,
    pi.ImageURL_2 AS image2,
    pi.ImageURL_3 AS image3,

    (
      SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'attribute', a.Attribute_Name,
                'value', pa.value
              )
            )
      FROM product_attributes pa
      JOIN attributes a ON pa.attribute_id = a.id
      WHERE pa.ProductID = p.ProductID
    ) AS attributes

FROM product p
JOIN batch b ON p.ProductID = b.ProductID
JOIN productsimages pi ON p.ProductID = pi.ProductID
GROUP BY p.ProductID, p.Product_Name, p.Description, pi.ImageURL_1, pi.ImageURL_2, pi.ImageURL_3, p.Product_Rating;
