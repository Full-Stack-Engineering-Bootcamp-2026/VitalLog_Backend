// domains/profile/service/profile.service.ts

import { Service } from "typedi";
import { ProfileRepository } from "../repository/profile.repository";
import { StorageService } from "../../../common/services/storage.service";

import { UploadProfileImageResponseDto } from "../dto/profile.dto";
import { BadRequestException } from "../../../common/exceptions/bad-request.exception";

@Service()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly storageService: StorageService,
  ) {}

  public async uploadProfileImage(
    userId: number,
    file?: Express.Multer.File, //receive img from multer
  ): Promise<UploadProfileImageResponseDto> {
    if (!file) {
      throw new BadRequestException("Profile image is required");
    }
    //extract extension=> .png etc
    const extension = file.originalname.split(".").pop();
    //generate unique file name =>profiles/user-5-17152555.png
    const fileName = `profiles/user-${userId}-${Date.now()}.${extension}`; //filekey

    await this.storageService.uploadFile(file, fileName);
    //saved filekey
    await this.profileRepository.updateByUserId(userId, {
      profileImageUrl: fileName,
    });
    //generate signed url
    const signedUrl = await this.storageService.getSignedFileUrl(fileName);

    return {
      profileImageUrl: signedUrl,
    };
  }
}
