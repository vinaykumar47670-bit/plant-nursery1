DROP DATABASE IF EXISTS plant_nursery;
CREATE DATABASE plant_nursery CHARACTER SET utf8mb4;
USE plant_nursery;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer','admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  scientific_name VARCHAR(150),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  light ENUM('Low','Medium','Bright') DEFAULT 'Medium',
  water ENUM('Low','Medium','High') DEFAULT 'Medium',
  care_tips TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  address TEXT NOT NULL,
  payment_method VARCHAR(30) DEFAULT 'Cash on Delivery',
  status ENUM('Placed','Packed','Shipped','Delivered','Cancelled') DEFAULT 'Placed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  plant_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (plant_id) REFERENCES plants(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plant_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Admin login: admin@nursery.com / password  (change after first login)
INSERT INTO users (name,email,password,role) VALUES
('Nursery Admin','admin@nursery.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin');

INSERT INTO categories (name) VALUES ('Indoor'),('Outdoor'),('Succulents'),('Flowering'),('Herbs'),('Fruit Plants');

INSERT INTO plants (category_id,name,scientific_name,description,price,stock,light,water,care_tips,image) VALUES
(1,'Monstera Deliciosa','Monstera deliciosa','Bold split leaves that make any corner look like a jungle. Easy to grow indoors.',799,25,'Medium','Medium','Water when the top 2 inches of soil are dry. Wipe leaves monthly. Give it a moss pole to climb.',''),
(1,'Snake Plant','Dracaena trifasciata','Nearly indestructible. Cleans indoor air and tolerates low light.',349,60,'Low','Low','Water every 2-3 weeks. Never let it sit in water.',''),
(1,'Money Plant','Epipremnum aureum','A trailing climber that grows in soil or a jar of water.',199,80,'Low','Medium','Change water weekly if grown in a jar. Trim to keep it bushy.',''),
(1,'Peace Lily','Spathiphyllum','White blooms and glossy leaves. Droops when thirsty, so it tells you when to water.',449,30,'Low','Medium','Keep soil lightly moist. Avoid direct afternoon sun.',''),
(2,'Areca Palm','Dypsis lutescens','Feathery fronds for balconies and bright rooms.',599,20,'Bright','Medium','Water when the top inch is dry. Feed monthly in summer.',''),
(2,'Bougainvillea','Bougainvillea glabra','Papery pink flowers that thrive in full sun and heat.',299,35,'Bright','Low','Water deeply but rarely. Prune after each flowering flush.',''),
(3,'Aloe Vera','Aloe barbadensis miller','Soothing gel plant that needs almost no attention.',179,70,'Bright','Low','Water every 2 weeks. Use gritty, fast-draining soil.',''),
(3,'Jade Plant','Crassula ovata','A tree-like succulent said to bring good luck.',249,40,'Bright','Low','Let soil dry out fully between waterings.',''),
(4,'Rose (Red)','Rosa','Classic fragrant roses for pots or garden beds.',229,45,'Bright','Medium','Needs 6 hours of sun. Prune in late winter.',''),
(4,'Hibiscus','Hibiscus rosa-sinensis','Large tropical flowers that bloom through the warm months.',269,30,'Bright','High','Water often in summer. Feed with a bloom booster.',''),
(5,'Tulsi (Holy Basil)','Ocimum tenuiflorum','Sacred herb used in teas and home remedies.',99,100,'Bright','Medium','Pinch off flower buds to keep leaves coming.',''),
(5,'Mint','Mentha','Fast-growing herb for drinks and cooking.',89,90,'Medium','High','Keep soil moist. Grow in its own pot because it spreads.',''),
(6,'Lemon Plant','Citrus limon','Dwarf lemon that fruits in a large pot.',549,18,'Bright','Medium','Feed with citrus fertilizer every month. Protect from frost.',''),
(6,'Guava Plant','Psidium guajava','Grafted guava that fruits within a year or two.',399,22,'Bright','Medium','Water twice a week in summer. Mulch around the base.','');
