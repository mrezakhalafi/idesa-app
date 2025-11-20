#!/bin/bash

# Step 1: Build project
echo "Running npm build..."
npm run build

# Step 2: Rename folder dist -> idesa-app (sementara buat zip)
echo "Preparing folder..."
cp -r dist idesa-app   # copy isi dist ke folder baru

# Step 3: Zip folder idesa-app
echo "Zipping into idesa-app.zip..."
rm -f idesa-app.zip    # hapus zip lama kalau ada
zip -r idesa-app.zip idesa-app
mv -f idesa-app.zip /home/$USER/Downloads/

# Step 4: Hapus folder sementara
rm -rf idesa-app
echo "Cleanup done. idesa-app folder removed."

# Step 5: Start dev server
echo "Starting npm dev..."
npm run dev &   # jalan di background

# Step 6: Jalankan server.js langsung dari root
cd server 
echo "Running server/server.js..."
node server.js
cd ..
