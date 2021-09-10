#!/bin/bash
set -e;

if [ -n "${DB_USER:-}" ] && [ -n "${DB_PASS:-}" ]; then
	"${mongo[@]}" "$DB_DEV" <<-EOJS
		db.createUser({
			user: $(_js_escape "$DB_USER"),
			pwd: $(_js_escape "$DB_PASS"),
			roles: [ { role: 'readWrite' , db: $(_js_escape "$DB_DEV") } ]
			})
	EOJS
	"${mongo[@]}" "$DB_TEST" <<-EOJS
		db.createUser({
			user: $(_js_escape "$DB_USER"),
			pwd: $(_js_escape "$DB_PASS"),
			roles: [ { role: 'readWrite' , db: $(_js_escape "$DB_TEST") } ]
			})
	EOJS
else
  echo "=============== MONGO INIT SCRIPT FAILED ==============="
  echo "${DB_DEV} ${DB_USER} ${DB_PASS}"
fi