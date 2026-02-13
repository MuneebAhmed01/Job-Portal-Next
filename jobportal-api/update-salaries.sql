-- Update existing jobs with parsed salary values
-- This SQL script updates the salary field based on salaryRange

UPDATE jobs 
SET salary = 
  CASE 
    WHEN salaryRange ~ '\$80k-\$100k' THEN 100000
    WHEN salaryRange ~ '\$100k-\$1000k' THEN 1000000
    WHEN salaryRange ~ '\$115,000 - \$165,000' THEN 165000
    WHEN salaryRange ~ '.*-.*k' THEN 
      (CAST(REGEXP_REPLACE(REGEXP_REPLACE(salaryRange, '.*-', ''), '[^0-9]', '') AS INTEGER) * 1000)
    WHEN salaryRange ~ '.*k.*' THEN 
      (CAST(REGEXP_REPLACE(salaryRange, '[^0-9]', '') AS INTEGER) * 1000)
    ELSE NULL
  END
WHERE salary IS NULL 
AND salaryRange IS NOT NULL 
AND salaryRange != '';
