echo "WARNING: THIS WILL DESTROY DATA. DO NOT RUN IN PRODUCTION."
read -p "Are you sure? (y/n) " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    yarn prisma db push --force-reset --accept-data-loss && yarn seed
fi
