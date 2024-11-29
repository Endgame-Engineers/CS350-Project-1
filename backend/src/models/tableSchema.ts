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
        recipeid BIGINT,
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
        "watergoal" float8,
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

export const activityLogSchema = `
    CREATE SEQUENCE IF NOT EXISTS "ActivityLogs_id_seq";
    CREATE TABLE IF NOT EXISTS "ActivityLogs" (
        "id" int4 NOT NULL DEFAULT nextval('"ActivityLogs_id_seq"'::regclass),
        "dateadded" timestamptz,
        "userid" int8,
        "activityid" int8,
        "durationminutes" int4,
        PRIMARY KEY ("id")
    );
`;

export const activitiesSchema = `
    CREATE SEQUENCE IF NOT EXISTS "Activities_id_seq";
    CREATE TABLE IF NOT EXISTS "Activities" (
        "id" int4 NOT NULL DEFAULT nextval('"Activities_id_seq"'::regclass),
        "activity" varchar,
        "description" varchar,
        "MET" float8,
        PRIMARY KEY ("id"),
    );
`;

// ingredients will be a JSON 0bject with barcode as key and servings as the value
export const recipeSchema = `
    CREATE SEQUENCE IF NOT EXISTS "Recipes_id_seq";
    CREATE TABLE IF NOT EXISTS "Recipes" (
        "id" int4 NOT NULL DEFAULT nextval('"Recipes_id_seq"'::regclass),
        "name" varchar,
        "userid" int8,
        "ingredients" jsonb,
        "servings" int4,
        "protein_per_serv" float8,
        "carb_per_serv" float8,
        "fat_per_serv" float8,
        "calories_per_serv" float8,
        "total_protein" float8,
        "total_carbs" float8,
        "total_fat" float8,
        "total_calories" float8,
        "dateadded" timestamptz,
        "lastupdated" timestamptz,
        PRIMARY KEY ("id")
    );
`;

export const accessTokenSchema = `
    CREATE SEQUENCE IF NOT EXISTS "AccessTokens_id_seq";
    CREATE TABLE IF NOT EXISTS "AccessTokens" (
        "id" int4 NOT NULL DEFAULT nextval('"AccessTokens_id_seq"'::regclass),
        "token" varchar,
        "userid" int8,
        "expires" boolean,
        "expiration" timestamptz,
        PRIMARY KEY ("id")
    );
`;