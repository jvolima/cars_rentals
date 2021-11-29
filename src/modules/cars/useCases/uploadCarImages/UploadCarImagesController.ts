import { Request, Response } from "express";
import { container } from "tsyringe";
import { UploadCarImagesUseCase } from "./UploadCarImagesUseCase";

interface IFiles {
  filename: string;
}

class UploadCarImagesController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const images = request.files as IFiles[];

    const images_name = images.map((file) => file.filename)

    const uploadCarImageUseCase = container.resolve(UploadCarImagesUseCase)

    await uploadCarImageUseCase.execute({
      car_id: id,
      images_name
    });

    return response.status(201).send();
  }
}

export { UploadCarImagesController }