create table "User"(
	"id" BIGSERIAL NOT NULL,
	"email" VARCHAR(75) UNIQUE NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"idCard" VARCHAR(25) UNIQUE NOT NULL,
	"firstName" VARCHAR(100) NOT NULL,
	"lastName" VARCHAR(100) NOT NULL,
	"phone" VARCHAR(25) NOT NULL,
	"dateOfBirth" DATE NOT NULL,
	"createdAt" TIMESTAMPTZ NULL,
	"updatedAt" TIMESTAMPTZ NULL,
	CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Role" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(75) UNIQUE NOT NULL,
	CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserRole" (
	"id" SERIAL NOT NULL,
	"idUser" BIGINT NOT NULL,
	"idRole" INTEGER NOT NULL,
	CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "UserRole_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "UserRole_idRole_fkey" FOREIGN KEY ("idRole") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE
);