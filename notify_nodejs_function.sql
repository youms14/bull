CREATE OR REPLACE FUNCTION notify_nodejs_function() RETURNS trigger AS $$
DECLARE
BEGIN
    
    PERFORM pg_notify('soldechannel',NEW.matricule ||','|| NEW.mois ||','|| NEW.annee ||','|| NEW.netapayer);
	RETURN new;
END;
$$ LANGUAGE plpgsql;


-- PERFORM pg_notify('soldechannel',row_to_json(NEW)::text);
-- PERFORM pg_notify('soldechannel',TG_TABLE_NAME || ',matricule,' || NEW.matricule);