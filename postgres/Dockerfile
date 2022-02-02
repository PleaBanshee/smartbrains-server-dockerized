# POSTGRES
FROM postgres:13.5

# Create tables: folder/files
# Instruction copies new files, directories or remote file URLs from <src> and adds them to the filesystem of the image at the path <dest>
ADD /tables/ /docker-entrypoint.initdb.d/tables/
ADD deploy_schemas.sql /docker-entrypoint.initdb.d/