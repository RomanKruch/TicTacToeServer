import { Module } from '@nestjs/common';
import { Websoket } from './websoket';

@Module({
    providers: [Websoket], 
    exports: [Websoket]
})
export class WebsoketModule {}
