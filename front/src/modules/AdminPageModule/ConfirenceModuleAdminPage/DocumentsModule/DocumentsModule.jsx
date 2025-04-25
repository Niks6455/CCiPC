import { server } from '../../../../apirequests/apirequests';
import FileComponent from '../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import { decodeFileName, decodeText } from '../../../../utils/functions/funcions';
import styles from './DocumentsModule.module.scss';
import borderIcon from '@assets/img/AdminPanel/border3.svg';

function DocumentsModule({ data, setData }) {
  const mapData = [
    {
      key: 'programConference',
      typeFile: ['application/pdf'],
      accept: '.pdf',
      name: 'programConference',
      icon: 'pdf',
      text: 'Неободимо загрузить<br/>файл в формате PDF',
      title: 'Программа конференции',
    },
    {
      key: 'informationLetter',
      typeFile: ['application/pdf'],
      accept: '.pdf',
      name: 'informationLetter',
      icon: 'pdf',
      text: 'Неободимо загрузить<br/>файл в формате PDF',
      title: 'Информационное письмо',
    },
    {
      key: 'worksCollection',
      typeFile: ['application/pdf'],
      accept: '.pdf',
      name: 'worksCollection',
      icon: 'pdf',
      text: 'Неободимо загрузить<br/>файл в формате PDF',
      title: 'Cборник научных трудов',
    },
    {
      key: 'аrticleTemplate',
      typeFile: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      accept: '.doc,.docx',
      name: 'аrticleTemplate',
      icon: 'doc',
      text: 'Неободимо загрузить<br/>файл в формате DOC',
      title: 'Шаблон статьи',
    },
    {
      key: 'cashlessIndividual',
      typeFile: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      accept: '.doc,.docx',
      name: 'cashlessIndividual',
      icon: 'doc',
      text: 'Неободимо загрузить<br/>файл в формате DOC',
      title: 'Договор оплаты безналичным расчётом для физического лица',
    },
    {
      key: 'cashlessEntities',
      typeFile: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      accept: '.doc,.docx',
      name: 'cashlessEntities',
      icon: 'doc',
      text: 'Неободимо загрузить<br/>файл в формате DOC',
      title: 'Договор оплаты безналичным расчётом для юридического лица',
    },
  ];

  const funChangeData = (value, key) => {
    setData({ ...data, [key]: value });
  };

  const funDeleteFile = id => {
    setData({ ...data, deleteIds: [...data.deleteIds, id] });
  };

  return (
    <div className={styles.DocumentsModule}>
      <div className={styles.container}>
        {mapData.map((item, index) => (
          <div key={index} className={styles.block}>
            <h3>{item.title}</h3>

            <div className={styles.file_container}>
              <img src={borderIcon} alt="img" className={styles.border} />
              <div className={styles.border_inner}>
                <FileComponent
                  logoHeader={
                    typeof data[item.key]?.url === 'string' && `${server}/${data[item.key]?.url}`
                  }
                  fileSize={50}
                  data={data[item.key]?.url}
                  itemKey={item.key}
                  setData={funChangeData}
                  typeFile={item.typeFile}
                  accept={item.accept}
                  fileName={
                    typeof data[item.key]?.url === 'string'
                      ? decodeText(data[item.key]?.name)
                      : data[item.key]?.name
                  }
                  name={item.name}
                  icon={item.icon}
                  text={item.text}
                  idFile={data[item.key]?.id}
                  funDeleteFile={funDeleteFile}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentsModule;
