import archiver from 'archiver';
import path from 'path';

export async function saveArchive(files, name , res) {

  res.attachment(`${name}.zip`);

  const archive = archiver('zip', {
    zlib: { level: 9 } // Уровень сжатия
  });
// Обрабатываем события
  archive.on('error', (err) => {
    throw err;
  });

// Указываем поток для записи архива в ответ
  archive.pipe(res);

// Добавляем файлы в архив
  files.forEach(file => {
    console.log(file.name);
    archive.file(file.path, { name: file.name }); // Добавляем файл с его именем
  });
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${name}.zip`);
  // Завершаем архивирование
  return await archive.finalize();
}


