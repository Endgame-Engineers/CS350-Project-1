export const foodItemSchema = `
    CREATE SEQUENCE IF NOT EXISTS "FoodItems_id_seq";
    CREATE TABLE IF NOT EXISTS "FoodItems" (
        "id" int4 NOT NULL DEFAULT nextval('"FoodItems_id_seq"'::regclass),
        "foodname" varchar,
        "barcode" varchar,
        "protein_per_serv" float8,
        "carb_per_serv" float8,
        "fat_per_serv" float8,
        "calories_per_serv" float8,
        "image" varchar,
        PRIMARY KEY ("id")
    );
`;

export const mealLogSchema = `
    CREATE SEQUENCE IF NOT EXISTS UserNutritionLog_id_seq;
    CREATE TABLE IF NOT EXISTS "MealLogs" (
        id INT NOT NULL DEFAULT nextval('UserNutritionLog_id_seq'::regclass),
        mealtype VARCHAR,
        dateadded VARCHAR,
        barcode VARCHAR,
        userid BIGINT,
        servingconsumed FLOAT8,
        PRIMARY KEY (id)
    );
`;

export const userSchema = `
    CREATE SEQUENCE IF NOT EXISTS "Users_id_seq";
    CREATE TABLE IF NOT EXISTS "Users" (
        "id" int4 NOT NULL DEFAULT nextval('"Users_id_seq"'::regclass),
        "username" varchar,
        "firstname" varchar,
        "lastname" varchar,
        "email" varchar,
        "uuid" uuid,
        "lastlogin" timestamptz,
        "providername" varchar,
        "providerid" varchar,
        "accesstoken" varchar,
        "refreshtoken" varchar,
        PRIMARY KEY ("id")
    );
`;

export const userStatsSchema = `
    CREATE SEQUENCE IF NOT EXISTS "UserStats_id_seq";
    CREATE TABLE IF NOT EXISTS "UserStats" (
        "id" int4 NOT NULL DEFAULT nextval('"UserStats_id_seq"'::regclass),
        "height" float8,
        "weight" float8,
        "caloriegoal" float8,
        "dateofbirth" timestamptz,
        "updatedon" timestamptz,
        "proteinpercentage" float4,
        "fatpercentage" float4,
        "carbpercentage" float4,
        "proteingrams" float4,
        "fatgrams" float4,
        "carbgrams" float4,
        "userid" int8,
        "sex" int2,
        "activitylevel" int2,
        "goal" int2,
        PRIMARY KEY ("id")
    );
`;

export const healthLogSchema = `
    CREATE SEQUENCE IF NOT EXISTS "HealthLogs_id_seq";
    CREATE TABLE IF NOT EXISTS "HealthLogs" (
        "id" int4 NOT NULL DEFAULT nextval('"HealthLogs_id_seq"'::regclass),
        "dateadded" timestamptz,
        "userid" int8,
        "caloriesburned" float8,
        "steps" int4,
        "heartrate" int4,
        PRIMARY KEY ("id")
    );
`;
