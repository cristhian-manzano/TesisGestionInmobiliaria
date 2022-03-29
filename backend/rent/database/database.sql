CREATE TABLE "Rent"(
	"id" BIGSERIAL NOT NULL,
	"paymentDay" INTEGER NOT NULL,
	"startDate" TIMESTAMPTZ NOT NULL,
	"endDate" TIMESTAMPTZ NULL,
	"securityDeposit" NUMERIC(8,2) NULL,
	"idProperty" BIGINT NOT NULL,
	"idOwner" BIGINT NOT NULL,
	"idTenant" BIGINT NOT NULL,
	CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "ContractFile"(
	"id" BIGSERIAL NOT NULL,
	"key" VARCHAR(255) NOT NULL,
	"url" TEXT NOT NULL,
	CONSTRAINT "ContractFile_pkey" PRIMARY KEY ("id")
);



CREATE TABLE "LeaseAgreement"(
	"id" BIGSERIAL NOT NULL,
	"startDate" TIMESTAMPTZ NOT NULL,
	"endDate" TIMESTAMPTZ NOT NULL,
	"idContractFile" BIGINT NULL,
	"active" BOOLEAN NOT NULL,
	"idRent" BIGINT NOT NULL,
	CONSTRAINT "LeaseAgreement_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "LeaseAgreement_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "LeaseAgreement_idContractFile_fkey" FOREIGN KEY ("idContractFile") REFERENCES "ContractFile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "PaymentFile"(
	"id" BIGSERIAL NOT NULL,
	"key" VARCHAR(255) NOT NULL,
	"url" TEXT NOT NULL,
	CONSTRAINT "PaymentFile_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Payment"(
	"id" BIGSERIAL NOT NULL,
	"code" VARCHAR(75) NULL,
	"amount" NUMERIC(8,2) NULL,
	"paymentDate"  TIMESTAMPTZ NOT NULL,
	"datePaid"  TIMESTAMPTZ NOT NULL,
	"validated" BOOLEAN NOT NULL,
	"dateRegister" TIMESTAMPTZ NOT NULL,
	"idPaymentFile" BIGINT NULL,
	"idRent" BIGINT NOT NULL,
	CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Payment_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Payment_idPaymentFile_fkey" FOREIGN KEY ("idPaymentFile") REFERENCES "PaymentFile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PaymentObservation"(
	"id" BIGSERIAL NOT NULL,
	"description" TEXT NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"idPayment" BIGINT NOT NULL,
	"idUser" BIGINT NOT NULL,
	CONSTRAINT "PaymentObservation_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "PaymentObservation_Payment_fkey" FOREIGN KEY ("idPayment") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Observation"(
	"id" BIGSERIAL NOT NULL,
	"description" TEXT NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"read" BOOLEAN NOT NULL,
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
	"read" BOOLEAN NOT NULL,
	"idUser" BIGINT NOT NULL,
	CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Comment_idObservation_fkey" FOREIGN KEY ("idObservation") REFERENCES "Observation"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

/* Experimental*/

CREATE TABLE "Notification"(
	"id" BIGSERIAL NOT NULL,
	"description" VARCHAR(75) NOT NULL,
	"entity" VARCHAR(75) NOT NULL,
	"idEntity" BIGINT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"read" BOOLEAN NOT NULL,
	"idSender" BIGINT NOT NULL,
	"idReceiver" BIGINT NOT NULL,
	CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PendingPayment"(
	"id" BIGSERIAL NOT NULL,
	"pendingDate" TIMESTAMPTZ NOT NULL,
	"idRent" BIGINT NOT NULL,
	CONSTRAINT "PendingPayment_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "PendingPayment_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
