import { ExperienceController } from '../services/experience-controller';
import { ExperienceInformation } from './experienceinformation';

export class Experience extends ExperienceInformation {

  constructor(
    private controller: ExperienceController,
    experienceData: ExperienceInformation) {
    super(experienceData);
  }

  public setData(key: string, value: string): Promise<void> {
    return this.controller.setData(this.key, key, value);
  }

  public setMilestone(milestone: string): Promise<void> {
    return this.controller.setMilestone(this.key, milestone);
  }

  public recordEvent(event: string): Promise<void> {
    return this.controller.recordEvent(this.key, event);
  }

  public setComplete(): Promise<void> {
    return this.controller.setComplete(this.key);
  }

  public setConverted(label?: string): Promise<void> {
    return this.controller.setConverted(this.key, label);
  }

  public setChildEntity(ocid?: string): Promise<void> {
    return this.controller.setChildEntity(this.key, ocid);
  }

  public repersonalize(contactData: { [key: string]: string; }): Promise<boolean> {
    return this.controller.repersonalize(this.key, contactData);
  }

}
