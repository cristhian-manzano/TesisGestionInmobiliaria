CREATE TABLE "Sector"(
	"id" SERIAL NOT NULL,
	"name" VARCHAR(100) NULL,
	CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TypeProperty"(
	"id" SERIAL NOT NULL,
	"name" VARCHAR(100) NULL,
	"additionalFeatures" JSONB NULL,
	CONSTRAINT "TypeProperty_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Property"(
	"id" BIGSERIAL NOT NULL,
	"tagName" VARCHAR(150) NULL,
	"description" TEXT NULL,
	"area"  NUMERIC(8,2) NULL,
	"price" NUMERIC(8,2) NULL,
	"address" VARCHAR(200) NULL,
	"available" BOOLEAN NULL,
	"additionalFeatures" JSONB,
	"idTypeProperty" INTEGER NOT NULL,
	"idSector" INTEGER NOT NULL,
	"idOwner" BIGINT NOT NULL,
	CONSTRAINT "Property_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Property_idSector_fkey" FOREIGN KEY ("idSector") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Property_idTypeProperty_fkey" FOREIGN KEY ("idTypeProperty") REFERENCES "TypeProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ImageProperty"(
	"id" BIGSERIAL NOT NULL,
	"key" VARCHAR(255) NOT NULL,
	"url" TEXT NOT NULL,
	"idProperty" BIGINT NOT NULL,
	CONSTRAINT "Image_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "ImageProperty_idProperty_fkey" FOREIGN KEY ("idProperty") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
