-- Migration: Ensure every account_type has a mapping in account_type_category

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION check_account_type_mapping()
RETURNS trigger AS $$
DECLARE
  missing_types TEXT[];
BEGIN
  SELECT ARRAY(
    SELECT unnest(enum_range(NULL::account_type))
    EXCEPT
    SELECT type FROM account_type_category
  ) INTO missing_types;

  IF array_length(missing_types, 1) > 0 THEN
    RAISE EXCEPTION 'Missing mapping(s) for account_type(s): %', missing_types;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 2. Drop the trigger if it already exists (for idempotency)
DROP TRIGGER IF EXISTS ensure_all_account_types_mapped ON account_type_category;

-- 3. Create a regular trigger (not a constraint trigger)
CREATE TRIGGER ensure_all_account_types_mapped
AFTER INSERT OR UPDATE OR DELETE ON account_type_category
FOR EACH STATEMENT
EXECUTE FUNCTION check_account_type_mapping(); 