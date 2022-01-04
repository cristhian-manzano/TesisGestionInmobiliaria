CREATE TABLE "Role" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(75) UNIQUE NOT NULL,
	CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

create table "User"(
	"id" BIGSERIAL NOT NULL,
	"email" VARCHAR(75) UNIQUE,
	"password" VARCHAR(50) NOT NULL,
	"idCard" VARCHAR(25) UNIQUE NULL,
	"firstName" VARCHAR(100) NOT NULL,
	"lastName" VARCHAR(100) NOT NULL,
	"phone" VARCHAR(25) NULL,
	"createdAt" TIMESTAMPTZ NULL,
	"updatedAt" TIMESTAMPTZ NULL,
	"idRole" INTEGER NOT NULL,
	CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "User_idRole_fkey" FOREIGN KEY ("idRole") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "TypeProperty"(
	"id" SERIAL NOT NULL,
	"name" VARCHAR(100) NULL,
	CONSTRAINT "TypeProperty_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Property"(
	"id" BIGSERIAL NOT NULL,
	"address" VARCHAR(200) NULL,
	"description" TEXT NULL,
	"area"  NUMERIC(8,2) NULL,
	"monthlyPrice" NUMERIC(8,2) NULL,
	"idTypeProperty" INTEGER NOT NULL,
	"idOwner" BIGINT NOT NULL,
	CONSTRAINT "Property_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Property_idTypeProperty_fkey" FOREIGN KEY ("idTypeProperty") REFERENCES "TypeProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Property_idOwner_fkey" FOREIGN KEY ("idOwner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ImageProperty"(
	"id" BIGSERIAL NOT NULL,
	"url" TEXT NOT NULL,
	"idProperty" BIGINT NOT NULL,
	CONSTRAINT "Image_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "ImageProperty_idProperty_fkey" FOREIGN KEY ("idProperty") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Rent"(
	"id" BIGSERIAL NOT NULL,
	"payday" INTEGER NOT NULL,
	"startDate" TIMESTAMPTZ NOT NULL,
	"endDate" TIMESTAMPTZ NULL,
	"securityDeposit" NUMERIC(8,2) NULL,
	"idProperty" BIGINT NOT NULL,
	"idTenant" BIGINT NOT NULL,
	CONSTRAINT "Rent_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Rent_idProperty_fkey" FOREIGN KEY ("idProperty") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Rent_idTenant_fkey" FOREIGN KEY ("idTenant") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "LeaseAgreement"(
	"id" BIGSERIAL NOT NULL,
	"startDate" TIMESTAMPTZ NOT NULL,
	"endDate" TIMESTAMPTZ NOT NULL,
	"file" TEXT NULL,
	"active" BOOLEAN NOT NULL,
	"idRent" BIGINT NOT NULL,
	CONSTRAINT "LeaseAgreement_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "LeaseAgreement_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "Payment"(
	"id" BIGSERIAL NOT NULL,
	"amount" NUMERIC(8,2) NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"datePaid"  TIMESTAMPTZ NOT NULL,
	"validated" BOOLEAN NOT NULL,
	"proofOfPayment" TEXT NOT NULL,
	"idRent" BIGINT NOT NULL,
	CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Payment_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "Observation"(
	"id" BIGSERIAL NOT NULL,
	"description" TEXT NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"solved" BOOLEAN NOT NULL,
	"idRent" BIGINT NOT NULL,
	"idUser" BIGINT NOT NULL,
	CONSTRAINT "Observation_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Observation_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Observation_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "Comment"(
	"id" BIGSERIAL NOT NULL,
	"description" TEXT NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"idObservation" BIGINT NOT NULL,
	"idUser" BIGINT NOT NULL,
	CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Comment_idObservation_fkey" FOREIGN KEY ("idObservation") REFERENCES "Observation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Comment_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
