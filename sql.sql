
create DATABASE  IF NOT EXISTS barge_diary;
use barge_diary;


DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  f_name varchar(45) NOT NULL,
  l_name varchar(45) DEFAULT NULL,
  email varchar(45) NOT NULL,
  `number` varchar(45) DEFAULT NULL,
  third_party_id varchar(45) DEFAULT NULL,
  `password` varchar(45) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (id),
  UNIQUE KEY email_UNIQUE (email),
  UNIQUE KEY number_UNIQUE (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS orginization;
CREATE TABLE orginization (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  `name` varchar(45) NOT NULL,
  `type` tinyint DEFAULT NULL,
  country mediumint DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  email varchar(45) NOT NULL,
  province varchar(45) DEFAULT NULL,
  currency int DEFAULT NULL,
  `language` int DEFAULT NULL,
  time_zone varchar(45) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY org_user_id_idx (user_id),
  CONSTRAINT org_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS extra_fields;
CREATE TABLE extra_fields (
  id int NOT NULL,
  user_id int NOT NULL,
  orginaztion_id int NOT NULL,
  place tinyint NOT NULL,
  `name` varchar(45) NOT NULL,
  `type` tinyint NOT NULL,
  required tinyint NOT NULL DEFAULT '0',
  show_in_table tinyint NOT NULL DEFAULT '0',
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY extra_field_id_idx (user_id),
  KEY extra_field_org_idx (orginaztion_id),
  CONSTRAINT extra_field_org FOREIGN KEY (orginaztion_id) REFERENCES orginization (id),
  CONSTRAINT extra_field_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS extra_field_value;
CREATE TABLE extra_field_value (
  id int NOT NULL,
  field_id int DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY extra_field_id_idx (field_id),
  CONSTRAINT extra_field_id FOREIGN KEY (field_id) REFERENCES extra_fields (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS orginaztion_user;
CREATE TABLE orginaztion_user (
  id int NOT NULL AUTO_INCREMENT,
  orginaztion_id int NOT NULL,
  user_id int NOT NULL,
  `status` tinyint NOT NULL,
  `role` tinyint NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY org_master_user_id_idx (user_id),
  KEY org_master_id_idx (orginaztion_id),
  CONSTRAINT org_master_id FOREIGN KEY (orginaztion_id) REFERENCES orginization (id),
  CONSTRAINT org_master_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS customer;
CREATE TABLE customer (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  imgUrl varchar(255) DEFAULT NULL,
  orginaztion_id int DEFAULT NULL,
  reg_document varchar(45) DEFAULT NULL,
  reg_number varchar(45) DEFAULT NULL,
  shipping_address varchar(45) DEFAULT NULL,
  billing_address varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  email varchar(45) DEFAULT NULL,
  website varchar(45) DEFAULT NULL,
  phone varchar(45) DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  KEY orginaztion_id_idx (orginaztion_id),
  CONSTRAINT orginaztion_id FOREIGN KEY (orginaztion_id) REFERENCES orginization (id),
  CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS customer_values;
CREATE TABLE customer_values (
  id int NOT NULL AUTO_INCREMENT,
  customer_id int DEFAULT NULL,
  field_id int DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY items_id_idx (customer_id),
  KEY customer_field_id_idx (field_id),
  CONSTRAINT customer_extra_id FOREIGN KEY (customer_id) REFERENCES customer (id),
  CONSTRAINT customer_field_id FOREIGN KEY (field_id) REFERENCES extra_fields (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS forwarder;
CREATE TABLE forwarder (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  imgUrl varchar(255) DEFAULT NULL,
  orginaztion_id int DEFAULT NULL,
  reg_document varchar(45) DEFAULT NULL,
  reg_number varchar(45) DEFAULT NULL,
  shipping_address varchar(45) DEFAULT NULL,
  billing_address varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  email varchar(45) DEFAULT NULL,
  website varchar(45) DEFAULT NULL,
  phone varchar(45) DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  KEY orginaztion_id_idx (orginaztion_id),
  CONSTRAINT forwader_org_id FOREIGN KEY (orginaztion_id) REFERENCES orginization (id),
  CONSTRAINT forwader_user_id FOREIGN KEY (id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS forwarder_values;
CREATE TABLE forwarder_values (
  id int NOT NULL AUTO_INCREMENT,
  forwarder_id int DEFAULT NULL,
  field_id int DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY items_id_idx (forwarder_id),
  KEY forwarder_field_id_idx (field_id),
  CONSTRAINT forwarder_extra_id FOREIGN KEY (forwarder_id) REFERENCES forwarder (id),
  CONSTRAINT forwarder_field_id FOREIGN KEY (field_id) REFERENCES extra_fields (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS invite_orginaztion_user;
CREATE TABLE invite_orginaztion_user (
  id int NOT NULL,
  user_id int NOT NULL,
  orginaztion_id int NOT NULL,
  `role` mediumint NOT NULL,
  email varchar(45) NOT NULL,
  link varchar(255) NOT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id,user_id),
  KEY invite_id_idx (orginaztion_id),
  KEY invite_user_id_idx (user_id),
  CONSTRAINT invite_org_id FOREIGN KEY (orginaztion_id) REFERENCES orginization (id),
  CONSTRAINT invite_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS items;
CREATE TABLE items (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  orginaztion_id int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  unit varchar(45) DEFAULT NULL,
  unit_price varchar(45) DEFAULT NULL,
  sku varchar(45) DEFAULT NULL,
  hazadrs mediumint DEFAULT NULL,
  privacy mediumint DEFAULT NULL,
  `Type` tinyint DEFAULT NULL,
  PRIMARY KEY (id),
  KEY items_user_id_idx (user_id),
  KEY items_org_id_idx (orginaztion_id),
  CONSTRAINT items_org_id FOREIGN KEY (orginaztion_id) REFERENCES orginization (id),
  CONSTRAINT items_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS item_documents;
CREATE TABLE item_documents (
  id int NOT NULL,
  item_id int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  link varchar(255) DEFAULT NULL,
  document_type tinyint DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY id_idx (item_id),
  CONSTRAINT items_doc_id FOREIGN KEY (item_id) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS item_media;
CREATE TABLE item_media (
  id int NOT NULL,
  char_id varchar(40) DEFAULT NULL,
  item_id int DEFAULT NULL,
  `type` tinyint DEFAULT NULL,
  link varchar(255) DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY show_id_UNIQUE (char_id),
  KEY items_media_idx (item_id),
  CONSTRAINT items_media FOREIGN KEY (item_id) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS items_values;
CREATE TABLE items_values (
  id int NOT NULL AUTO_INCREMENT,
  item_id int DEFAULT NULL,
  field_id int DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY items_id_idx (item_id),
  CONSTRAINT item_extra_id FOREIGN KEY (item_id) REFERENCES items (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS media_files;
CREATE TABLE media_files (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  char_media varchar(40) DEFAULT NULL,
  link varchar(255) DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  CONSTRAINT id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS orginization_user_access;
CREATE TABLE orginization_user_access (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  orginization_id int DEFAULT NULL,
  table_id tinyint DEFAULT NULL,
  access tinyint(1) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS token;
CREATE TABLE token (
  token varchar(255) NOT NULL,
  user_id int DEFAULT NULL,
  country varchar(4) DEFAULT NULL,
  ip varchar(10) DEFAULT NULL,
  device_id varchar(30) DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  `status` int DEFAULT '1',
  PRIMARY KEY (token),
  KEY token_user_id_idx (user_id),
  CONSTRAINT token_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS user_info;
CREATE TABLE user_info (
  user_id int NOT NULL,
  country int NOT NULL,
  img_url varchar(220) DEFAULT NULL,
  email_verified tinyint DEFAULT NULL,
  number_verified tinyint DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS vendor;
CREATE TABLE vendor (
  id int NOT NULL AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  imgUrl varchar(255) DEFAULT NULL,
  orginaztion_id int DEFAULT NULL,
  reg_document varchar(45) DEFAULT NULL,
  reg_number varchar(45) DEFAULT NULL,
  shipping_address varchar(45) DEFAULT NULL,
  billing_address varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  email varchar(45) DEFAULT NULL,
  website varchar(45) DEFAULT NULL,
  phone varchar(45) DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id_idx (user_id),
  KEY orginaztion_id_idx (orginaztion_id),
  CONSTRAINT vendor_org_id FOREIGN KEY (orginaztion_id) REFERENCES users (id),
  CONSTRAINT vendor_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS vendor_values;
CREATE TABLE vendor_values (
  id int NOT NULL AUTO_INCREMENT,
  vendor_id int DEFAULT NULL,
  field_id int DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY items_id_idx (vendor_id),
  KEY vendor_field_extra_idx (field_id),
  CONSTRAINT vendor_extra_field_id FOREIGN KEY (field_id) REFERENCES extra_fields (id),
  CONSTRAINT vendor_extra_id FOREIGN KEY (vendor_id) REFERENCES vendor (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
