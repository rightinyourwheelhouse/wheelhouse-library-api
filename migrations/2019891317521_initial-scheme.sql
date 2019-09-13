CREATE SCHEMA "Library";

CREATE TABLE "Library"."Account" (
    id character varying(36) NOT NULL UNIQUE PRIMARY KEY,
    username character varying(128) NOT NULL,
    avatar character varying(512) NOT NULL,
    CONSTRAINT "Account_id_key" UNIQUE (id)
);

CREATE TABLE "Library"."Book" (
    id character varying(36) NOT NULL UNIQUE PRIMARY KEY,
    title character varying(512) NOT NULL,
    author character varying(128),
    ISBN character varying(14) NOT NULL,
    pages integer,
    rating decimal,
    coverImg character varying(1024),
    rentalPeriod smallint DEFAULT 21,
    ownerId character varying(36),
    CONSTRAINT "Book_id_key" UNIQUE (id),
    CONSTRAINT "Book_ownerId_fkey" FOREIGN KEY (ownerId) REFERENCES "Library"."Account"(id)
);

CREATE TABLE "Library"."Rental" (
    id SERIAL UNIQUE PRIMARY KEY,
    accountId character varying(36) NOT NULL,
    bookId character varying(36) NOT NULL,
    startDate date DEFAULT now() NOT NULL,
    CONSTRAINT "Rental_id_key" UNIQUE (id),
    CONSTRAINT "Rental_accountId_fkey" FOREIGN KEY (accountId) REFERENCES "Library"."Account"(id),
    CONSTRAINT "Rental_bookId_fkey" FOREIGN KEY (bookId) REFERENCES "Library"."Book"(id)
);
