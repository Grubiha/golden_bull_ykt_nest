export class MulterFile {
  buffer: Buffer
  mimetype: string
  originalname: string
  constructor(data = null){
    this.buffer = data?.buffer
    this.mimetype = data?.mimetype
    this.originalname = data?.originalname
  }
}