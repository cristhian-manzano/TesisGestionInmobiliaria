CREATE TABLE "Rent"(
	"id" BIGSERIAL NOT NULL,
	"payday" INTEGER NOT NULL,
	"startDate" TIMESTAMPTZ NOT NULL,
	"endDate" TIMESTAMPTZ NULL,
	"securityDeposit" NUMERIC(8,2) NULL,
	"idProperty" BIGINT NOT NULL,
	"idTenant" BIGINT NOT NULL,
	CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
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
	"code" VARCHAR(75) NULL,
	"amount" NUMERIC(8,2) NULL,
	"paymentDate"  TIMESTAMPTZ NOT NULL,
	"datePaid"  TIMESTAMPTZ NOT NULL,
	"validated" BOOLEAN NOT NULL,
	"proofOfPayment" TEXT NOT NULL,
	"dateRegister" TIMESTAMPTZ NOT NULL,
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
	CONSTRAINT "Observation_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "Comment"(
	"id" BIGSERIAL NOT NULL,
	"description" TEXT NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"idObservation" BIGINT NOT NULL,
	"idUser" BIGINT NOT NULL,
	CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Comment_idObservation_fkey" FOREIGN KEY ("idObservation") REFERENCES "Observation"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
