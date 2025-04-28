import archiver from 'archiver';

export async function saveArchive(files, name , res) {

  res.attachment(`${name}.zip`);

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.on('error', (err) => {
    throw err;
  });
  archive.pipe(res);

  files.forEach(file => {
    archive.file(file.path, { name: file.name });
  });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${name}.zip`);

  return await archive.finalize();
}


